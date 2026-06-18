import OpenAI from "openai";
import { NextResponse } from "next/server";
import { mockImprovementPlan } from "@/lib/mock-data";
import type {
  ImprovementAnalysisSnapshot,
  ImprovementPlanRequest,
  ImprovementPlanResponse,
} from "@/lib/types";
import improvementPlanSchema from "@/schemas/improvement-plan.schema.json";

type ValidImprovementPlanRequest = ImprovementPlanRequest & {
  analysisSnapshot: ImprovementAnalysisSnapshot;
};

function hasRequiredInputs(
  data: Partial<ImprovementPlanRequest>
): data is ValidImprovementPlanRequest {
  const snapshot = data.analysisSnapshot;

  return Boolean(
    data.jobId &&
      data.timeline &&
      data.timeCommitment &&
      data.budget &&
      data.credibilityPath &&
      snapshot &&
      snapshot.jobTitle &&
      snapshot.company &&
      snapshot.fit &&
      snapshot.applicationStrategy &&
      snapshot.cv
  );
}

function buildImprovementPlanPrompt(body: ValidImprovementPlanRequest): string {
  return `
Create a personalized role-readiness improvement plan for a candidate.

This plan should help the candidate become a stronger applicant for the target role or similar roles.

Use only the supplied analysis snapshot and user preferences. Do not invent candidate experience. Do not use internet research. Do not recommend specific current courses, providers, or certifications by name unless they are generic and widely understood categories.

## Target role

Job title:
${body.analysisSnapshot.jobTitle}

Company / brand name:
${body.analysisSnapshot.company}

## Fit analysis snapshot

${JSON.stringify(body.analysisSnapshot, null, 2)}

## Candidate preferences

Timeline:
${body.timeline}

Time commitment:
${body.timeCommitment}

Budget:
${body.budget}

Preferred credibility path:
${body.credibilityPath}

## Task

Return a structured improvement plan that includes:

1. roleSummary
2. criticalGaps
3. realityCheck
4. recommendedActions
5. freeOptions
6. paidOptions
7. practicalActions
8. roadmap
9. bestNextActions

## Planning philosophy

This is not a generic learning plan.

The plan should be based on the candidate's actual fit gaps, screening risks, and current evidence.

Prioritize evidence-building over passive learning.

A stronger candidate is someone who can show credible proof, not just someone who completed a course.

## Fit-aware rules

If the candidate is a strong fit or good fit:
- Focus on sharpening proof, positioning, and interview readiness.
- Recommend targeted actions that strengthen already credible evidence.

If the candidate is a stretch fit:
- Focus on bridging the most important evidence gaps.
- Recommend practical artifacts, small projects, or proof points the candidate can create.
- Be honest about what cannot be fixed quickly.

If the candidate is low probability or not yet:
- Be direct and realistic.
- Do not suggest quick fixes for major gaps.
- Recommend longer-term proof-building and adjacent roles if relevant.

## Budget rules

If the budget is €0 only or appears to mean free-only:
- Prioritize free/resource-light options.
- Paid options should be empty or explain that paid options are not recommended for the selected budget.

If the budget allows paid learning:
- Suggest types of paid options, not specific providers.
- Keep paid options practical and non-hypey.
- Do not imply that paying for a course guarantees job readiness.

## Timeline rules

Do not make fake-precise promises like "become fully qualified in 30 days."

Use the user's selected timeline to set a realistic plan.

Roadmap phases may use labels such as:
- This week
- 2-4 week focus
- 1-3 month proof-building path
- Longer-term credibility building

## Recommended actions rules

Each recommended action should map to a real gap.

For each action, explain:
- which gap it addresses
- why the gap matters
- the best action type
- estimated effort
- expected impact

## Practical action examples

Good practical actions include:
- building a short portfolio artifact
- writing a positioning brief
- preparing a campaign audit
- creating a sample launch plan
- documenting a performance marketing test plan
- improving proof around a specific tool, channel, market, or stakeholder need
- preparing interview stories around existing evidence

Bad practical actions include:
- vague advice like "learn more marketing"
- generic "take a course"
- fake confidence-building
- unsupported claims
- copying job description keywords without evidence

## Tone

Be honest, useful, and specific.

Do not shame the candidate.

Do not overpromise.

Do not sound like a motivational coach.

Create a plan that a serious candidate could actually use.
`;
}

const IMPROVEMENT_PLAN_SYSTEM_PROMPT = `
You are the FitSignal role-readiness roadmap engine.

Your job is to create a realistic, personalized improvement plan for a candidate based on their fit analysis and preferences.

You are not a generic course recommender.
You are not a motivational coach.
You are not selling false hope.

The plan should help the candidate answer:

"How do I become a stronger candidate for this role type?"

## Core principles

1. Be honest.
2. Be practical.
3. Be specific to the role and candidate.
4. Prioritize evidence-building over passive learning.
5. Do not invent candidate experience.
6. Do not recommend fake shortcuts.
7. Do not promise that a course, certificate, or small project guarantees hiring success.
8. Adapt the plan to the candidate's time, budget, and preferred credibility path.
9. Distinguish quick positioning improvements from real skill or evidence gaps.
10. Keep the plan useful even if the candidate is a stretch or low-probability fit.

## Output requirements

Return only valid JSON matching the provided schema.

Do not include markdown.

Do not include explanations outside the JSON.

Do not add fields that are not in the schema.

The response must set success to true.

The response message should be short and user-facing.

The plan must be grounded in the supplied analysis snapshot and preferences.
`;

async function generateImprovementPlan(
  body: ValidImprovementPlanRequest
): Promise<ImprovementPlanResponse> {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5.5",
    store: false,
    input: [
      {
        role: "system",
        content: IMPROVEMENT_PLAN_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: buildImprovementPlanPrompt(body),
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: improvementPlanSchema.name,
        strict: improvementPlanSchema.strict,
        schema: improvementPlanSchema.schema,
      },
    },
  });

  const outputText = response.output_text;

  if (!outputText) {
    throw new Error("OpenAI returned no improvement plan output text.");
  }

  return JSON.parse(outputText) as ImprovementPlanResponse;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ImprovementPlanRequest>;

    if (!hasRequiredInputs(body)) {
      return NextResponse.json(
        {
          error:
            "All improvement-plan answers and the analysis snapshot are required.",
        },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      console.warn("OPENAI_API_KEY is missing. Returning mock improvement plan.");
      return NextResponse.json(mockImprovementPlan);
    }

    const response = await generateImprovementPlan(body);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Improvement plan route error:", error);

    return NextResponse.json(
      {
        error:
          "The improvement plan could not be generated. Please try again.",
      },
      { status: 500 }
    );
  }
}