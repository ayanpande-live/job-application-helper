"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Wordmark } from "@/components/ui/Logo";
import { CheckCircle, SparkleIcon } from "@/components/ui/icons";
import { EmailCaptureModal } from "@/components/EmailCaptureModal";
import { ImprovementPlanModal } from "@/components/ImprovementPlanModal";
import {
          downloadCoverLetterDocx,
          downloadCvDocx,
        } from "@/lib/document-export";
import { createMockAnalysis, mockImprovementPlan } from "@/lib/mock-data";
import type {
  AnalysisResult,
  AnalysisSource,
  FitVerdict,
  ImprovementAnalysisSnapshot,
  RequestedAction,
  RoleImprovementPlan,
} from "@/lib/types";

interface ResultsDashboardProps {
  jobId: string;
}

type TabKey =
  | "fit"
  | "strategy"
  | "cv"
  | "cover"
  | "outreach"
  | "roadmap";

const tabs: { key: TabKey; label: string }[] = [
  { key: "fit", label: "Fit Verdict" },
  { key: "strategy", label: "Application Strategy" },
  { key: "cv", label: "Updated CV" },
  { key: "cover", label: "Cover Letter" },
  { key: "outreach", label: "Outreach" },
  { key: "roadmap", label: "Roadmap" },
];

const verdictTone: Record<FitVerdict, string> = {
  strong_fit: "bg-good/10 text-good",
  good_fit: "bg-good/10 text-good",
  stretch_fit: "bg-warn/10 text-warn",
  low_probability: "bg-bad/10 text-bad",
  not_yet: "bg-bad/10 text-bad",
};
function SourceBadge({ source }: { source: AnalysisSource }) {
  const isOpenAI = source === "openai";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] ${
        isOpenAI ? "bg-good/10 text-good" : "bg-warn/10 text-warn"
      }`}
    >
      {isOpenAI ? "AI-generated" : "Prototype mock"}
    </span>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div>
      {eyebrow ? (
        <div className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-muted">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="mt-1 text-[26px] font-black tracking-tighter2">{title}</h2>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-[14.5px] font-medium leading-[1.55] text-muted">
          <span className="mt-1 shrink-0 text-good">
            <CheckCircle className="h-4 w-4" />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function TextBlock({ text }: { text: string }) {
  return (
    <div className="whitespace-pre-line rounded-[16px] border border-line bg-canvas p-5 text-[14.5px] font-medium leading-[1.65] text-ink">
      {text}
    </div>
  );
}

export function ResultsDashboard({ jobId }: ResultsDashboardProps) {
  const [result, setResult] = useState<AnalysisResult>(() => createMockAnalysis(jobId));
  const [activeTab, setActiveTab] = useState<TabKey>("fit");
  const [emailAction, setEmailAction] = useState<RequestedAction | null>(null);
  const [improvementOpen, setImprovementOpen] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<RoleImprovementPlan | null>(null);

  useEffect(() => {
    const stored = window.sessionStorage.getItem(`analysis:${jobId}`);
    if (stored) {
      try {
        setResult(JSON.parse(stored) as AnalysisResult);
      } catch {
        setResult(createMockAnalysis(jobId));
      }
    }
  }, [jobId]);

  const plan = useMemo(
  () => generatedPlan ?? mockImprovementPlan.plan,
  [generatedPlan]
);

const analysisSnapshot: ImprovementAnalysisSnapshot = useMemo(
  () => ({
    jobTitle: result.jobTitle,
    company: result.company,
    fit: result.fit,
    applicationStrategy: result.applicationStrategy,
    cv: {
      profile: result.cv.profile,
      keySkills: result.cv.keySkills,
      atsKeywords: result.cv.atsKeywords,
      changeNotes: result.cv.changeNotes,
    },
  }),
  [result]
);

const sectionSources = result.sectionSources ?? {
  fit: "mock",
  strategy: "mock",
  cv: "mock",
  coverLetter: "mock",
  outreach: "mock",
  roadmap: "mock",
};

const roadmapSource: AnalysisSource = generatedPlan
  ? "openai"
  : sectionSources.roadmap;
  return (
    <main className="min-h-screen bg-canvas">
      <header className="mx-auto flex max-w-[1180px] items-center justify-between px-6 py-6 sm:px-8">
        <Link href="/">
          <Wordmark />
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/analyze">
            <Button variant="secondary">New analysis</Button>
          </Link>
          <Button onClick={() => setEmailAction("email_results")}>Email results</Button>
        </div>
      </header>

      <section className="mx-auto max-w-[1180px] px-6 pb-24 pt-6 sm:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <Card className="p-6">
              <div className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-muted">
                {result.company}
              </div>
              <h1 className="mt-2 text-[31px] font-black leading-[1.08] tracking-tighter2">
                {result.jobTitle}
              </h1>
              <div className={`mt-5 inline-flex rounded-full px-3 py-1.5 text-[12px] font-black uppercase tracking-[0.06em] ${verdictTone[result.fit.verdict]}`}>
                {result.fit.verdictLabel}
              </div>
              <div className="mt-5 flex items-end gap-2">
                <span className="text-[54px] font-black tracking-tightest">
                  {result.fit.score}
                </span>
                <span className="pb-3 text-[14px] font-bold text-muted">/ 100</span>
              </div>
              <p className="mt-2 text-[14.5px] font-medium leading-[1.55] text-muted">
                {result.fit.summary}
              </p>
              <div className="mt-6 rounded-[15px] bg-soft p-4">
                <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-muted">
                  Positioning line
                </div>
                <p className="mt-2 text-[14.5px] font-extrabold leading-[1.4]">
                  {result.fit.positioning}
                </p>
              </div>
            </Card>
          </aside>

          <div>
            <div className="mb-5 flex gap-2 overflow-x-auto rounded-[16px] border border-line bg-surface p-1.5 shadow-card">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`shrink-0 rounded-[12px] px-3.5 py-2.5 text-[13.5px] font-extrabold transition-colors ${
                    activeTab === tab.key
                      ? "bg-accent text-white"
                      : "text-muted hover:bg-soft hover:text-ink"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "fit" ? (
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <Card className="p-6">
                  <SectionTitle eyebrow="Why you match" title="Strongest evidence" />
                  <div className="mt-3">
                    <SourceBadge source={sectionSources.fit} />
                  </div>
                    <div className="mt-5 space-y-4">
                    {result.fit.strengths.map((item) => (
                      <div key={item.label} className="rounded-[15px] bg-soft p-4">
                        <div className="font-black">{item.label}</div>
                        <p className="mt-1 text-[14px] font-medium leading-[1.55] text-muted">
                          {item.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="p-6">
                  <SectionTitle eyebrow="What could hurt" title="Likely screening risks" />
                  <div className="mt-5 space-y-4">
                    {result.fit.gaps.map((item) => (
                      <div key={item.label} className="rounded-[15px] border border-line p-4">
                        <div className="font-black">{item.label}</div>
                        <p className="mt-1 text-[14px] font-medium leading-[1.55] text-muted">
                          {item.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            ) : null}

            {activeTab === "strategy" ? (
              <Card className="p-6">
                <SectionTitle eyebrow="Application strategy" title="How to apply intelligently" />
                <div className="mt-3">
                  <SourceBadge source={sectionSources.strategy} />
                </div>
                <div className="mt-5 rounded-[16px] bg-soft p-5">
                  <div className="text-[15px] font-black">Should you apply?</div>
                  <p className="mt-2 text-[14.5px] font-medium leading-[1.6] text-muted">
                    {result.applicationStrategy.shouldApply}
                  </p>
                </div>
                <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
                  <div className="rounded-[16px] border border-line p-5">
                    <div className="text-[15px] font-black">What to emphasize</div>
                    <BulletList items={result.applicationStrategy.whatToEmphasize} />
                  </div>
                  <div className="rounded-[16px] border border-line p-5">
                    <div className="text-[15px] font-black">What not to overclaim</div>
                    <BulletList items={result.applicationStrategy.whatToAvoidOverclaiming} />
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
                  <div className="rounded-[16px] border border-line p-5">
                    <div className="text-[15px] font-black">Positioning advice</div>
                    <p className="mt-2 text-[14.5px] font-medium leading-[1.6] text-muted">
                      {result.applicationStrategy.positioningAdvice}
                    </p>
                  </div>
                  <div className="rounded-[16px] border border-line p-5">
                    <div className="text-[15px] font-black">Screening risks</div>
                    <BulletList items={result.applicationStrategy.screeningRisks} />
                  </div>
                </div>
              </Card>
            ) : null}

            {activeTab === "cv" ? (
              <Card className="p-6">
                <SectionTitle eyebrow="Updated CV" title="Role-aligned CV draft" />
                <div className="mt-3">
                  <SourceBadge source={sectionSources.cv} />
                </div>
                <div className="mt-5 space-y-5">
                  <div>
                    <div className="mb-2 text-[15px] font-black">Profile</div>
                    <TextBlock text={result.cv.profile} />
                  </div>
                  <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                    <div>
                      <div className="mb-2 text-[15px] font-black">Key skills</div>
                      <div className="flex flex-wrap gap-2">
                        {result.cv.keySkills.map((skill) => (
                          <span key={skill} className="rounded-full bg-soft px-3 py-1.5 text-[12.5px] font-extrabold">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 text-[15px] font-black">ATS keywords</div>
                      <div className="flex flex-wrap gap-2">
                        {result.cv.atsKeywords.map((keyword) => (
                          <span key={keyword} className="rounded-full border border-line bg-surface px-3 py-1.5 text-[12.5px] font-bold text-muted">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 text-[15px] font-black">Experience bullets</div>
                    <div className="space-y-4">
                      {result.cv.experienceSections.map((section) => (
                        <div key={section.role} className="rounded-[16px] border border-line p-5">
                          <div className="font-black">{section.role}</div>
                          <BulletList items={section.bullets} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 text-[15px] font-black">What changed</div>
                    <BulletList items={result.cv.changeNotes} />
                  </div>
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button variant="secondary" onClick={() => downloadCvDocx(result)}>
                    Download CV (.docx)
                  </Button>
                  <Button variant="secondary" onClick={() => setEmailAction("download_cv")}>
                    Email me the CV draft
                  </Button>
                </div>
              </Card>
            ) : null}

            {activeTab === "cover" ? (
              <Card className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <SectionTitle eyebrow="Cover letter" title="Drafted from the fit strategy" />
              <div className="mt-3">
                <SourceBadge source={sectionSources.coverLetter} />
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="secondary"
                onClick={() => downloadCoverLetterDocx(result, "full")}
              >
                Download full (.docx)
              </Button>
              <Button
                variant="secondary"
                onClick={() => downloadCoverLetterDocx(result, "short")}
              >
                Download short (.docx)
              </Button>
              </div>
            </div>
                <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.15fr_.85fr]">
                  <div>
                    <div className="mb-2 text-[15px] font-black">Full version</div>
                    <TextBlock text={result.coverLetter.full} />
                  </div>
                  <div className="space-y-5">
                    <div>
                      <div className="mb-2 text-[15px] font-black">Short version</div>
                      <TextBlock text={result.coverLetter.short} />
                    </div>
                    <div>
                      <div className="mb-2 text-[15px] font-black">Subject lines</div>
                      <div className="space-y-2">
                        {result.coverLetter.subjectLines.map((line) => (
                          <div key={line} className="rounded-[12px] border border-line bg-canvas px-4 py-3 text-[13.5px] font-bold">
                            {line}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ) : null}

            {activeTab === "outreach" ? (
            <div className="space-y-5">
                <div>
                  <SourceBadge source={sectionSources.outreach} />
                </div>

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                {result.outreach.map((msg) => (
                  <Card key={msg.label} className="p-6">
                    <div className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-muted">
                      {msg.label}
                    </div>
                    <div className="mt-2 text-[15px] font-black">{msg.to}</div>
                    <p className="mt-4 text-[14.5px] font-medium leading-[1.6] text-muted">
                      {msg.body}
                    </p>
                  </Card>
                ))}
              </div>
            </div>

            ) : null}

            {activeTab === "roadmap" ? (
              <div className="space-y-5">
                <Card className="p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <SectionTitle eyebrow="Role readiness" title="Improve your fit plan" />
                      <div className="mt-3">
                        <SourceBadge source={roadmapSource} />
                      </div>
                      <p className="mt-3 max-w-[700px] text-[14.5px] font-medium leading-[1.6] text-muted">
                        Generate an opt-in plan tailored around your fit gaps, time,
                        budget and preferred way to build credibility. The preview below
                        shows the intended structure until you generate your own plan.
                      </p>
                    </div>
                    <Button onClick={() => setImprovementOpen(true)}>
                      Build my plan
                    </Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-[0.08em] text-muted">
                    <SparkleIcon className="h-4 w-4" />
                    {generatedPlan ? "AI role readiness plan" : "Mock role readiness plan"}
                  </div>
                  <h2 className="mt-2 text-[24px] font-black tracking-tighter2">
                    {plan.roleSummary}
                  </h2>
                  <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
                    <div className="rounded-[16px] border border-line p-5">
                      <div className="font-black">Critical gaps</div>
                      <BulletList items={plan.criticalGaps} />
                    </div>
                    <div className="rounded-[16px] border border-line p-5">
                      <div className="font-black">Reality check</div>
                      <BulletList items={plan.realityCheck} />
                    </div>
                    <div className="rounded-[16px] border border-line p-5">
                      <div className="font-black">Best next actions</div>
                      <BulletList items={plan.bestNextActions} />
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
                    {plan.roadmap.map((phase) => (
                      <div key={phase.period} className="rounded-[16px] bg-soft p-5">
                        <div className="text-[12px] font-black uppercase tracking-[0.08em] text-muted">
                          {phase.period}
                        </div>
                        <div className="mt-2 font-black">{phase.title}</div>
                        <BulletList items={phase.actions} />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <EmailCaptureModal
        open={emailAction !== null}
        jobId={jobId}
        requestedAction={emailAction ?? "email_results"}
        onClose={() => setEmailAction(null)}
      />

      <ImprovementPlanModal
        open={improvementOpen}
        jobId={jobId}
        analysisSnapshot={analysisSnapshot}
        onClose={() => setImprovementOpen(false)}
        onPlanGenerated={(newPlan) => {
          setGeneratedPlan(newPlan);
          setActiveTab("roadmap");
          setEmailAction("improvement_plan");
        }}
      />
    </main>
  );
}
