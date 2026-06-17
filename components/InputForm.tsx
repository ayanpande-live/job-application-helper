"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Wordmark } from "@/components/ui/Logo";
import { CheckCircle, UploadIcon } from "@/components/ui/icons";
import { deliverables } from "@/lib/mock-data";
import type { AnalyzeRequest } from "@/lib/types";

interface InputFormProps {
  values: AnalyzeRequest;
  onChange: (patch: Partial<AnalyzeRequest>) => void;
  onSubmit: () => void;
  onLoadSample: () => void;
  error?: string | null;
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 flex items-center justify-between text-[14.5px] font-bold">
        <span>{label}</span>
        {required ? (
          <span className="font-semibold text-bad">Required</span>
        ) : (
          <span className="font-medium text-muted">optional</span>
        )}
      </label>
      {children}
    </div>
  );
}

const textareaClass =
  "w-full rounded-2xl border border-line bg-surface px-4 py-[15px] text-[14.5px] font-medium leading-[1.55] shadow-card outline-none transition-colors focus:border-accent/40";

const inputClass =
  "w-full rounded-2xl border border-line bg-surface px-4 py-[13px] text-[14.5px] font-medium shadow-card outline-none transition-colors focus:border-accent/40";

export function InputForm({
  values,
  onChange,
  onSubmit,
  onLoadSample,
  error,
}: InputFormProps) {
  const canSubmit =
    values.cv.trim().length > 40 && values.jobDescription.trim().length > 40;

  return (
    <main className="min-h-screen bg-canvas">
      <header className="mx-auto flex max-w-[1120px] items-center justify-between px-6 py-6 sm:px-8">
        <Link href="/" aria-label="Home">
          <Wordmark />
        </Link>
        <Button variant="secondary" onClick={onLoadSample}>
          Load sample example
        </Button>
      </header>

      <div className="mx-auto max-w-[1080px] animate-fadeUp px-6 pb-24 pt-8 sm:px-8 lg:pt-12">
        <div className="max-w-[640px]">
          <div className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-muted">
            Step 1 · Job fit analysis
          </div>
          <h1 className="mt-3 text-[36px] font-black leading-[1.05] tracking-tighter2 sm:text-[48px]">
            Tell us about the role.
          </h1>
          <p className="mt-4 text-[16.5px] font-medium leading-[1.6] text-muted">
            Paste your CV and the job description. The prototype will return an
            honest fit verdict, strategy, and tailored application assets.
          </p>
        </div>

        <div className="mt-9 grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_300px]">
          <div className="flex flex-col gap-[22px]">
            <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
              <Field label="Target job title">
                <input
                  value={values.jobTitle ?? ""}
                  onChange={(e) => onChange({ jobTitle: e.target.value })}
                  placeholder="e.g. Regional Growth Manager"
                  className={inputClass}
                />
              </Field>
              <Field label="Company name">
                <input
                  value={values.company ?? ""}
                  onChange={(e) => onChange({ company: e.target.value })}
                  placeholder="e.g. Company name"
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Your CV" required>
              <textarea
                value={values.cv}
                onChange={(e) => onChange({ cv: e.target.value })}
                rows={8}
                placeholder="Paste your CV text here. For Phase 1, pasted text is safer and easier than file upload."
                className={textareaClass}
              />
            </Field>

            <div className="flex items-start gap-3.5 rounded-2xl border-[1.5px] border-dashed border-line bg-surface p-[18px]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-soft text-muted">
                <UploadIcon />
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-bold">PDF upload coming soon</div>
                <div className="mt-0.5 text-[13px] font-medium leading-[1.5] text-muted">
                  For this prototype, paste your CV text above. This avoids fake
                  upload behavior and keeps the first version simple.
                </div>
              </div>
            </div>

            <Field label="Job description" required>
              <textarea
                value={values.jobDescription}
                onChange={(e) => onChange({ jobDescription: e.target.value })}
                rows={8}
                placeholder="Paste the job posting here. Include responsibilities, requirements and any preferred qualifications."
                className={textareaClass}
              />
            </Field>

            <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
              <Field label="Strengths your team would endorse">
                <textarea
                  value={values.strengths ?? ""}
                  onChange={(e) => onChange({ strengths: e.target.value })}
                  rows={4}
                  placeholder="2–3 credible strengths, with short proof if possible."
                  className={textareaClass}
                />
              </Field>
              <Field label="Areas to improve">
                <textarea
                  value={values.improvements ?? ""}
                  onChange={(e) => onChange({ improvements: e.target.value })}
                  rows={4}
                  placeholder="2 realistic gaps or development areas."
                  className={textareaClass}
                />
              </Field>
            </div>

            {error ? (
              <div className="rounded-2xl border border-bad/20 bg-bad/5 px-4 py-3 text-[14px] font-semibold text-bad">
                {error}
              </div>
            ) : null}

            <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button size="lg" disabled={!canSubmit} onClick={onSubmit}>
                Analyze my fit →
              </Button>
              <span className="text-[13px] font-medium text-muted">
                Fields must include enough text to create a useful analysis.
              </span>
            </div>
          </div>

          <Card className="sticky top-[90px] p-6">
            <div className="text-[12px] font-bold uppercase tracking-[0.06em] text-muted">
              What you&apos;ll get
            </div>
            <div className="mt-4 flex flex-col gap-3.5">
              {deliverables.map((d) => (
                <div key={d} className="flex items-start gap-[11px]">
                  <span className="mt-px shrink-0 text-good">
                    <CheckCircle />
                  </span>
                  <span className="text-[14.5px] font-semibold leading-[1.35]">
                    {d}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[14px] bg-soft p-4 text-[13px] font-medium leading-[1.55] text-muted">
              This is a mock-data prototype. The UI and flow are real; OpenAI,
              Supabase and n8n will be wired in later steps.
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
