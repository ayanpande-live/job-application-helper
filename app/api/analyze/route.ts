import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createMockAnalysis } from "@/lib/mock-data";
import type {
  AnalyzeRequest,
  CvDraft,
  FitVerdict,
  AnalysisResult,
} from "@/lib/types";
import fitAnalysisSchema from "@/schemas/fit-analysis.schema.json";
import cvDraftSchema from "@/schemas/cv-draft.schema.json";

function isValidPayload(data: Partial<AnalyzeRequest>): data is AnalyzeRequest {
  return (
    typeof data.cv === "string" &&
    data.cv.trim().length > 40 &&
    typeof data.jobDescription === "string" &&
    data.jobDescription.trim().length > 40
  );
}

function getVerdictLabel(verdict: FitVerdict): string {
  const labels: Record<FitVerdict, string> = {
    strong_fit: "Strong Fit",
    good_fit: "Good Fit",
    stretch_fit: "Stretch Fit",
    low_probability: "Low Probability",
    not_yet: "Not Yet",
  };

  return labels[verdict];
}

function buildFitAnalysisPrompt(body: AnalyzeRequest): string {
  return `
Analyze the candidate's fit for the following job.

Use the CV, job description, candidate-endorsed strengths, and candidate improvement areas as your only evidence.

Evaluate actual fit honestly. Do not inflate the score. Do not invent missing experience.

## Candidate CV

${body.cv}

## Job description

${body.jobDescription}

## Candidate-endorsed strengths

${body.strengths || "Not provided."}

## Candidate improvement areas

${body.improvements || "Not provided."}

## Optional role metadata

Job title:
${body.jobTitle || "Not provided."}

Company:
${body.company || "Not provided."}

## Task

Return a structured fit analysis that includes:

1. Fit verdict
2. Fit score
3. Score rationale
4. Target role type
5. Employer priorities
6. Strongest matches
7. Main gaps
8. Application strategy
9. Next best actions

Remember: this product is not just a CV rewriting tool. It is an honest job-fit and application strategy tool.
`;
}

function buildCvDraftPrompt(
  body: AnalyzeRequest,
  fitAnalysis: OpenAIFitAnalysis
): string {
  return `
Create a tailored CV draft for the candidate based on the candidate CV, job description, candidate inputs, and fit analysis.

The CV must be tailored to the role, but it must not overstate the candidate's fit.

Use the fit verdict and fit score to decide how assertive or conservative the tailoring should be.

## Candidate CV

${body.cv}

## Job description

${body.jobDescription}

## Candidate-endorsed strengths

${body.strengths || "Not provided."}

## Candidate improvement areas

${body.improvements || "Not provided."}

## Fit analysis

${JSON.stringify(fitAnalysis, null, 2)}

## Task

Return a structured tailored CV draft with:

1. A role-aligned professional profile
2. Key skills supported by the CV
3. ATS keywords supported by the CV
4. Experience sections with rewritten bullets
5. Short portal role descriptions
6. Change notes explaining:
   - what was emphasized
   - what was reframed
   - what was reduced
   - what important job requirements were not included because the CV lacks evidence

## Important rules

Do not invent missing requirements.

Do not include unsupported ATS keywords.

Do not exaggerate ownership, seniority, technical ability, domain expertise, or commercial responsibility.

Do not make a weak fit look like a strong fit.

Create the strongest honest version of the candidate for this specific job.
`;
}

const FIT_ANALYSIS_SYSTEM_PROMPT = `
You are the FitSignal fit analysis engine.

Your job is to evaluate how well a candidate fits a specific job based only on the evidence provided in the CV, job description, candidate-endorsed strengths, and candidate improvement areas.

You are not a motivational coach. You are an honest application strategist.

Your goal is to help the user answer:

"Should I apply to this job, and if yes, how should I position myself?"

## Core principles

1. Be honest, not flattering.
2. Do not inflate scores to make the user feel better.
3. Do not invent experience, tools, metrics, industries, responsibilities, education, languages, certifications, or achievements.
4. Separate actual fit from application quality.
5. Identify real gaps clearly.
6. Distinguish between gaps that can be fixed by better positioning and gaps that require real experience, skills, credentials, or time.
7. Do not treat keyword overlap as proof of fit.
8. Do not overvalue generic soft skills unless they are clearly important to the job and supported by evidence.
9. If the job has non-negotiable requirements and the CV does not show them, reflect that in the score and verdict.
10. Be practical and specific.

## Fit score philosophy

The score should represent the candidate's actual competitiveness for the role, not how good a rewritten CV could sound.

Use this calibration:

- 90–100: Strong fit. Candidate naturally matches most core requirements and has credible evidence for the role.
- 80–89: Good fit. Candidate is credible and worth applying, with some manageable gaps.
- 70–79: Stretch fit. Candidate has relevant experience but meaningful gaps. Application must be positioned carefully.
- 60–69: Meaningful stretch / low probability. Candidate has adjacent experience but lacks important evidence or requirements.
- 36–59: Low probability. Candidate has limited adjacent overlap but is missing major requirements.
- 16–35: Very low fit. Candidate only has broad professional overlap and lacks the core role experience.
- 0–15: Hard mismatch. Candidate lacks the central qualification, credential, license, domain, or role experience required for the job.

If a job requires a non-negotiable credential, license, certification, language, degree, work authorization, or regulated professional qualification that is missing from the CV, the score should usually be 0–15.

If the candidate lacks the central role family experience entirely, the score should usually be 0–25.

Do not give scores above 85 unless the CV clearly supports most of the job's core requirements.

Do not give scores above 75 if the candidate lacks multiple must-have requirements.

Do not give scores above 65 if the candidate lacks the central experience the employer is hiring for.

Do not give scores above 35 when the only overlap is general business, communication, stakeholder, marketing, project, or analytical experience rather than the actual role requirements.

## Fit verdict definitions

Use exactly one of these verdicts:

- strong_fit: The candidate is naturally competitive for this role.
- good_fit: The candidate has a credible case, with some manageable gaps.
- stretch_fit: The candidate may be viable, but only with sharp positioning.
- low_probability: The role is unlikely based on current evidence, though there may be adjacent strengths.
- not_yet: The candidate should probably build more proof before applying.

## Analysis style

Be concise but useful.

Write in clear business English.

Avoid generic phrases like:
- "Leverage your skills"
- "Showcase your experience"
- "You are a dynamic professional"
- "This role is a perfect fit"

Instead, explain:
- what evidence helps the candidate
- what evidence is missing
- how the candidate should position themselves
- what they should avoid overclaiming
- what the likely screening risks are

## Output requirements

Return only valid JSON matching the provided schema.

Do not include markdown.

Do not include explanations outside the JSON.

Do not add fields that are not in the schema.

Every claim must be grounded in the supplied CV and job description.
`;

const CV_DRAFT_SYSTEM_PROMPT = `
You are the FitSignal tailored CV engine.

Your job is to create the strongest honest version of a candidate's CV for a specific job.

You are not a generic CV writer.
You are an honest application strategist who rewrites the CV based only on evidence that already exists.

The goal is not to make the candidate sound perfect.
The goal is to make the candidate's most relevant real evidence easy for a recruiter or hiring manager to see.

## Core principles

1. Be useful, but stay honest.
2. Do not invent experience, tools, industries, metrics, responsibilities, certifications, languages, education, job titles, seniority, management scope, quota ownership, or domain expertise.
3. Do not hide major gaps by using vague language.
4. Do not keyword-stuff.
5. Do not turn adjacent experience into direct experience.
6. Do not turn exposure into ownership.
7. Do not turn support work into leadership unless leadership is clearly supported.
8. Do not turn contribution into sole accountability.
9. Do not exaggerate seniority.
10. Every bullet must be traceable to the supplied CV, candidate-endorsed strengths, or fit analysis.

## Fit-aware tailoring rules

Use the fit verdict and fit score to decide how aggressively to tailor.

If the candidate is a strong_fit or good_fit:
- Create a confident, role-aligned CV draft.
- Put the strongest matching evidence near the top.
- Use clear commercial and role-relevant language.
- Emphasize direct matches to the job description.

If the candidate is a stretch_fit:
- Create a careful positioning CV.
- Emphasize transferable and adjacent evidence.
- Make the candidate's strongest credible case without pretending they already fully match the role.
- Use changeNotes to identify important gaps that were not covered in the CV because evidence was missing.

If the candidate is low_probability or not_yet:
- Create a conservative CV draft.
- Do not force the CV to sound like a strong match.
- Emphasize only genuinely relevant evidence.
- Use changeNotes to clearly explain which major requirements could not be reflected because the CV lacks evidence.
- Do not produce a misleadingly polished CV that hides hard blockers.

## Evidence discipline

For every rewritten bullet:
- Use only facts supported by the CV.
- Preserve the real level of ownership.
- Preserve the real scope.
- Preserve the real type of achievement.
- Preserve uncertainty where evidence is limited.

Examples of forbidden upgrades:
- Do not change "supported" into "owned" unless ownership is explicit.
- Do not change "worked with sales teams" into "led sales strategy" unless leadership is explicit.
- Do not change "contributed to revenue impact" into "delivered revenue" unless direct accountability is explicit.
- Do not add tools from the job description unless they appear in the CV or are clearly supported by the candidate's evidence.
- Do not add industry expertise from the job description unless the CV supports it.

## ATS keyword rules

Only include ATS keywords that are honestly supported by the CV.

A keyword is supported if:
- it appears directly in the CV, or
- the CV contains clear evidence of the underlying skill or responsibility.

Do not include unsupported job-description keywords just because they may improve ATS matching.

If an important job keyword is missing or weakly supported, do not include it in keySkills or atsKeywords.
Instead, mention it in changeNotes as a missing or weak evidence area.

## Recruiter-screening logic

Write the CV so that a recruiter can quickly understand:
- why this candidate is relevant
- which evidence matches the job
- what level of seniority and ownership the candidate actually has
- what makes the candidate worth considering
- where the candidate may still have gaps

Prioritize the evidence a recruiter would look for in the first 10 seconds.

## Writing style

Use clear, specific, business-focused language.

Avoid generic CV filler such as:
- dynamic professional
- passionate about
- proven track record
- excellent communication skills
- responsible for
- results-driven
- highly motivated
- fast-paced environment

Prefer bullets that show:
- action
- scope
- method
- outcome, where evidence exists

Do not invent numbers.
If no metric exists, write a strong qualitative bullet without fake quantification.

## Structure and length guidance

Profile:
- 3 to 5 lines maximum.
- Tailored to the role, but honest about the candidate's actual background.

Key skills:
- 8 to 12 items.
- Only include supported skills.

ATS keywords:
- 10 to 18 items.
- Only include supported keywords.

Experience sections:
- Prioritize recent and role-relevant roles.
- Use 3 to 6 bullets for highly relevant roles.
- Use fewer bullets for less relevant roles.
- Do not expand weakly relevant older experience just to fill space.

Portal role descriptions:
- 1 to 2 concise sentences per role.
- Useful for LinkedIn, job portals, or application forms.

Change notes:
- 4 to 8 concise notes.
- Explain what was emphasized, reframed, reduced, or intentionally not included.
- Mention important job requirements that could not be reflected because the CV lacks evidence.

## Output requirements

Return only valid JSON matching the provided schema.

Do not include markdown.

Do not include explanations outside the JSON.

Do not add fields that are not in the schema.

The CV should be stronger, clearer, and more relevant, but it must remain grounded in the supplied evidence.
`;

type OpenAIFitAnalysis = {
  fit_verdict: FitVerdict;
  fit_score: number;
  score_rationale: string;
  target_role_type: string;
  employer_priorities: string[];
  strongest_matches: {
    match: string;
    evidence: string;
    why_it_matters: string;
  }[];
  main_gaps: {
    gap: string;
    gap_type:
      | "skill_gap"
      | "evidence_gap"
      | "seniority_gap"
      | "domain_gap"
      | "keyword_gap"
      | "geography_language_gap"
      | "none";
    severity: "low" | "medium" | "high";
    why_it_matters: string;
    can_be_addressed_by_positioning: boolean;
  }[];
  application_strategy: {
    should_apply: string;
    positioning_advice: string;
    what_to_emphasize: string[];
    what_to_avoid_overclaiming: string[];
    screening_risks: string[];
  };
  next_best_actions: string[];
};

function applyOpenAIFitToMockResult(
  mockResult: AnalysisResult,
  openAiFit: OpenAIFitAnalysis
): AnalysisResult {
  return {
    ...mockResult,
    fit: {
      score: openAiFit.fit_score,
      verdict: openAiFit.fit_verdict,
      verdictLabel: getVerdictLabel(openAiFit.fit_verdict),
      summary: openAiFit.score_rationale,
      positioning: openAiFit.application_strategy.positioning_advice,
      strengths: openAiFit.strongest_matches.map((item) => ({
        label: item.match,
        detail: `${item.evidence} ${item.why_it_matters}`,
      })),
      gaps: openAiFit.main_gaps.map((item) => ({
        label: item.gap,
        detail: `${item.why_it_matters} Severity: ${item.severity}. ${
          item.can_be_addressed_by_positioning
            ? "This can partly be addressed through positioning."
            : "This requires real proof, experience, or skill-building."
        }`,
      })),
    },
    applicationStrategy: {
      shouldApply: openAiFit.application_strategy.should_apply,
      positioningAdvice: openAiFit.application_strategy.positioning_advice,
      whatToEmphasize: openAiFit.application_strategy.what_to_emphasize,
      whatToAvoidOverclaiming:
        openAiFit.application_strategy.what_to_avoid_overclaiming,
      screeningRisks: openAiFit.application_strategy.screening_risks,
    },
  };
}

async function generateOpenAIFitAnalysis(
  body: AnalyzeRequest
): Promise<OpenAIFitAnalysis> {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5.5",
    store: false,
    input: [
      {
        role: "system",
        content: FIT_ANALYSIS_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: buildFitAnalysisPrompt(body),
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: fitAnalysisSchema.name,
        strict: fitAnalysisSchema.strict,
        schema: fitAnalysisSchema.schema,
      },
    },
  });

  const outputText = response.output_text;

  if (!outputText) {
    throw new Error("OpenAI returned no fit analysis output text.");
  }

  return JSON.parse(outputText) as OpenAIFitAnalysis;
}

async function generateOpenAICvDraft(
  body: AnalyzeRequest,
  fitAnalysis: OpenAIFitAnalysis
): Promise<CvDraft> {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5.5",
    store: false,
    input: [
      {
        role: "system",
        content: CV_DRAFT_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: buildCvDraftPrompt(body, fitAnalysis),
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: cvDraftSchema.name,
        strict: cvDraftSchema.strict,
        schema: cvDraftSchema.schema,
      },
    },
  });

  const outputText = response.output_text;

  if (!outputText) {
    throw new Error("OpenAI returned no CV draft output text.");
  }

  return JSON.parse(outputText) as CvDraft;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<AnalyzeRequest>;

    if (!isValidPayload(body)) {
      return NextResponse.json(
        { error: "Please provide enough CV text and job description text." },
        { status: 400 }
      );
    }

    const jobId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `job-${Date.now()}`;

    const mockResult = createMockAnalysis(jobId, body);

    const mockOnlyResult: AnalysisResult = {
      ...mockResult,
      sectionSources: {
        fit: "mock",
        strategy: "mock",
        cv: "mock",
        coverLetter: "mock",
        outreach: "mock",
        roadmap: "mock",
      },
    };

    if (!process.env.OPENAI_API_KEY) {
      console.warn("OPENAI_API_KEY is missing. Returning mock analysis.");
      return NextResponse.json(mockOnlyResult);
    }

    console.log("Calling OpenAI fit analysis...");
    const openAiFit = await generateOpenAIFitAnalysis(body);
    console.log("OpenAI fit analysis received.");

    console.log("Calling OpenAI CV draft...");
    const openAiCv = await generateOpenAICvDraft(body, openAiFit);
    console.log("OpenAI CV draft received.");

    const result: AnalysisResult = {
      ...applyOpenAIFitToMockResult(mockResult, openAiFit),
      cv: openAiCv,
      sectionSources: {
        fit: "openai",
        strategy: "openai",
        cv: "openai",
        coverLetter: "mock",
        outreach: "mock",
        roadmap: "mock",
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analyze route error:", error);

    return NextResponse.json(
      {
        error:
          "The analysis could not be generated. Please try again with a shorter CV or job description.",
      },
      { status: 500 }
    );
  }
}