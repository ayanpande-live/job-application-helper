import type {
  AnalysisResult,
  AnalyzeRequest,
  EmailCaptureRequest,
  EmailCaptureResponse,
  ImprovementPlanRequest,
  ImprovementPlanResponse,
} from "./types";

async function postJson<TReq, TRes>(url: string, body: TReq): Promise<TRes> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let detail = "";
    try {
      const data = (await res.json()) as { error?: string };
      detail = data.error ? `: ${data.error}` : "";
    } catch {
      detail = "";
    }
    throw new Error(`Request to ${url} failed with ${res.status}${detail}`);
  }

  return (await res.json()) as TRes;
}

export function analyze(req: AnalyzeRequest): Promise<AnalysisResult> {
  return postJson<AnalyzeRequest, AnalysisResult>("/api/analyze", req);
}

export function captureEmail(req: EmailCaptureRequest): Promise<EmailCaptureResponse> {
  return postJson<EmailCaptureRequest, EmailCaptureResponse>(
    "/api/email-capture",
    req
  );
}

export function createImprovementPlan(
  req: ImprovementPlanRequest
): Promise<ImprovementPlanResponse> {
  return postJson<ImprovementPlanRequest, ImprovementPlanResponse>(
    "/api/improvement-plan",
    req
  );
}
