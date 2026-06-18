import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createMockAnalysis } from "@/lib/mock-data";
import type { AnalyzeRequest, FitVerdict, AnalysisResult } from "@/lib/types";
import fitAnalysisSchema from "@/schemas/fit-analysis.schema.json";

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
- 60–69: Low probability. Candidate has some adjacent experience but lacks important evidence or requirements.
- Below 60: Not yet. Candidate is missing major requirements or the move is not credible without additional proof.

Do not give scores above 85 unless the CV clearly supports most of the job's core requirements.

Do not give scores above 75 if the candidate lacks multiple must-have requirements.

Do not give scores above 65 if the candidate lacks the central experience the employer is hiring for.

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
    roadmap: openAiFit.next_best_actions.map((action, index) => ({
      n: index + 1,
      title: `Next action ${index + 1}`,
      detail: action,
      action,
    })),
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
    throw new Error("OpenAI returned no output text.");
  }

  return JSON.parse(outputText) as OpenAIFitAnalysis;
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

const result: AnalysisResult = {
  ...applyOpenAIFitToMockResult(mockResult, openAiFit),
  sectionSources: {
    fit: "openai",
    strategy: "openai",
    cv: "mock",
    coverLetter: "mock",
    outreach: "mock",
    roadmap: "openai",
  },
};

return NextResponse.json(result);  } catch (error) {
    console.error("Analyze route error:", error);

    return NextResponse.json(
      {
        error:
          "The fit analysis could not be generated. Please try again with a shorter CV or job description.",
      },
      { status: 500 }
    );
  }
}