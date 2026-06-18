"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CloseButton, Modal } from "@/components/ui/Modal";
import { createImprovementPlan } from "@/lib/api";
import { intakeQuestions } from "@/lib/mock-data";
import type {
  ImprovementAnalysisSnapshot,
  ImprovementPlanRequest,
  RoleImprovementPlan,
} from "@/lib/types";

type IntakeKey = "timeline" | "timeCommitment" | "budget" | "credibilityPath";
type Intake = Record<IntakeKey, string>;

const EMPTY: Intake = {
  timeline: "",
  timeCommitment: "",
  budget: "",
  credibilityPath: "",
};

interface ImprovementPlanModalProps {
  open: boolean;
  jobId: string;
  analysisSnapshot: ImprovementAnalysisSnapshot;
  onClose: () => void;
  onPlanGenerated?: (plan: RoleImprovementPlan) => void;
}

export function ImprovementPlanModal({
  open,
  jobId,
  analysisSnapshot,
  onClose,
  onPlanGenerated,
}: ImprovementPlanModalProps) {
  const [intake, setIntake] = useState<Intake>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const complete = (Object.keys(EMPTY) as IntakeKey[]).every((k) => intake[k]);

  function handleClose() {
    onClose();
    window.setTimeout(() => {
      setIntake(EMPTY);
      setSubmitting(false);
      setError(null);
    }, 200);
  }

  async function handleSubmit() {
    if (!complete || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const payload: ImprovementPlanRequest = {
        jobId,
        ...intake,
        analysisSnapshot,
      };

      const response = await createImprovementPlan(payload);
      onPlanGenerated?.(response.plan);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} maxWidth={580}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[22px] font-black tracking-[-0.025em]">
            Build your Role Readiness Plan
          </div>
          <p className="mt-2 text-[14px] font-medium leading-[1.55] text-muted">
            Four quick questions so the plan can balance free resources, paid
            learning and practical proof-building around your reality.
          </p>
        </div>
        <CloseButton onClick={handleClose} />
      </div>

      <div className="mt-6 flex flex-col gap-[22px]">
        {intakeQuestions.map((q) => (
          <div key={q.key}>
            <div className="mb-2.5 text-[14.5px] font-bold">{q.label}</div>
            <div className="flex flex-wrap gap-2">
              {q.options.map((opt) => {
                const selected = intake[q.key] === opt;

                return (
                  <button
                    key={opt}
                    onClick={() =>
                      setIntake((prev) => ({ ...prev, [q.key]: opt }))
                    }
                    className={`cursor-pointer rounded-[10px] px-[15px] py-[9px] text-[13.5px] font-bold transition-colors ${
                      selected
                        ? "border-[1.5px] border-accent bg-accent text-white"
                        : "border border-line bg-surface text-ink hover:bg-soft"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {error ? (
          <div className="rounded-xl bg-bad/5 px-3 py-2 text-[13px] font-semibold text-bad">
            {error}
          </div>
        ) : null}

        <Button
          className="w-full"
          disabled={!complete || submitting}
          onClick={handleSubmit}
        >
          {submitting ? "Generating…" : "Generate my plan"}
        </Button>
      </div>
    </Modal>
  );
}