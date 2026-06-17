import { NextResponse } from "next/server";
import { mockImprovementPlan } from "@/lib/mock-data";
import type { ImprovementPlanRequest } from "@/lib/types";

function hasFourAnswers(data: Partial<ImprovementPlanRequest>) {
  return Boolean(
    data.jobId &&
      data.timeline &&
      data.timeCommitment &&
      data.budget &&
      data.credibilityPath
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ImprovementPlanRequest>;

    if (!hasFourAnswers(body)) {
      return NextResponse.json(
        { error: "All four improvement-plan answers are required." },
        { status: 400 }
      );
    }

    // Phase 1 stub: later this should generate a personalized plan via OpenAI.
    return NextResponse.json(mockImprovementPlan);
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }
}
