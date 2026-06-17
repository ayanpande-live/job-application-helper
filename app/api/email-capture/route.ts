import { NextResponse } from "next/server";
import type { EmailCaptureRequest, EmailCaptureResponse } from "@/lib/types";

function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && /\S+@\S+\.\S+/.test(value);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<EmailCaptureRequest>;

    if (!isValidEmail(body.email) || body.consent !== true) {
      return NextResponse.json(
        { error: "A valid email and consent are required." },
        { status: 400 }
      );
    }

    // Phase 1 stub: later this route should call N8N_EMAIL_CAPTURE_WEBHOOK_URL.
    const response: EmailCaptureResponse = {
      success: true,
      message: "Email capture accepted in mock mode.",
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }
}
