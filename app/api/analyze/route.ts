import { NextResponse } from "next/server";
import { createMockAnalysis } from "@/lib/mock-data";
import type { AnalyzeRequest } from "@/lib/types";

function isValidPayload(data: Partial<AnalyzeRequest>): data is AnalyzeRequest {
  return (
    typeof data.cv === "string" &&
    data.cv.trim().length > 40 &&
    typeof data.jobDescription === "string" &&
    data.jobDescription.trim().length > 40
  );
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

    // Phase 1 stub: replace this with the real OpenAI Responses API call later.
    const result = createMockAnalysis(jobId, body);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }
}
