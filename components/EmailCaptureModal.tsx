"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CloseButton, Modal } from "@/components/ui/Modal";
import { captureEmail } from "@/lib/api";
import type { RequestedAction } from "@/lib/types";

interface EmailCaptureModalProps {
  open: boolean;
  jobId?: string;
  requestedAction: RequestedAction;
  onClose: () => void;
}

const copyByAction: Record<RequestedAction, { title: string; body: string; cta: string }> = {
  email_results: {
    title: "Email me my results",
    body: "We’ll send a copy of this prototype output to your inbox when the email workflow is connected.",
    cta: "Send results",
  },
  download_cv: {
    title: "Get the CV draft",
    body: "Leave your email so we can send the tailored CV draft when export is enabled.",
    cta: "Send CV draft",
  },
  improvement_plan: {
    title: "Send my improvement plan",
    body: "We’ll send your role-readiness plan and keep you updated as this feature evolves.",
    cta: "Send improvement plan",
  },
  product_updates: {
    title: "Join the private beta list",
    body: "Get updates as the prototype moves toward real OpenAI-powered analysis.",
    cta: "Join list",
  },
};

export function EmailCaptureModal({
  open,
  jobId,
  requestedAction,
  onClose,
}: EmailCaptureModalProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copy = copyByAction[requestedAction];
  const valid = email.includes("@") && consent;

  function reset() {
    setEmail("");
    setFirstName("");
    setConsent(false);
    setSubmitting(false);
    setSuccess(false);
    setError(null);
  }

  function handleClose() {
    onClose();
    window.setTimeout(reset, 200);
  }

  async function handleSubmit() {
    if (!valid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await captureEmail({
        email,
        firstName,
        jobId,
        requestedAction,
        consent,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} maxWidth={500}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[22px] font-black tracking-[-0.025em]">
            {success ? "You’re on the list." : copy.title}
          </div>
          <p className="mt-2 text-[14px] font-medium leading-[1.55] text-muted">
            {success
              ? "Thanks — the current prototype confirms the flow. The real email relay will be connected in the next integration step."
              : copy.body}
          </p>
        </div>
        <CloseButton onClick={handleClose} />
      </div>

      {success ? (
        <Button className="mt-6 w-full" onClick={handleClose}>
          Close
        </Button>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="you@email.com"
            className="w-full rounded-[12px] border border-line bg-canvas px-3.5 py-3 text-[14.5px] font-medium outline-none focus:border-accent/40"
          />
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            type="text"
            placeholder="First name (optional)"
            className="w-full rounded-[12px] border border-line bg-canvas px-3.5 py-3 text-[14.5px] font-medium outline-none focus:border-accent/40"
          />
          <label className="mt-0.5 flex cursor-pointer items-start gap-2.5">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-[3px] h-4 w-4 shrink-0 accent-accent"
            />
            <span className="text-[12.5px] font-medium leading-[1.45] text-muted">
              Email me this result and occasional product updates. I can
              unsubscribe anytime.
            </span>
          </label>

          {error ? (
            <div className="rounded-xl bg-bad/5 px-3 py-2 text-[13px] font-semibold text-bad">
              {error}
            </div>
          ) : null}

          <Button className="mt-1.5 w-full" disabled={!valid || submitting} onClick={handleSubmit}>
            {submitting ? "Submitting…" : copy.cta}
          </Button>
        </div>
      )}
    </Modal>
  );
}
