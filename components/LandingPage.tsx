import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Wordmark } from "@/components/ui/Logo";
import { ArrowRight, CheckCircle, SparkleIcon } from "@/components/ui/icons";
import { deliverables, landingSteps } from "@/lib/mock-data";

export function LandingPage() {
  return (
    <main className="min-h-screen bg-canvas">
      <header className="mx-auto flex max-w-[1120px] items-center justify-between px-6 py-6 sm:px-8">
        <Wordmark />
        <Link href="/analyze">
          <Button variant="secondary">Try prototype</Button>
        </Link>
      </header>

      <section className="mx-auto grid max-w-[1120px] grid-cols-1 gap-10 px-6 pb-20 pt-10 sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:pb-28 lg:pt-16">
        <div className="animate-fadeUp">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[12px] font-extrabold uppercase tracking-[0.08em] text-muted shadow-card">
            <SparkleIcon className="h-3.5 w-3.5" />
            AI Job Fit & Application Strategy
          </div>

          <h1 className="mt-6 max-w-[720px] text-[46px] font-black leading-[0.98] tracking-tightest text-ink sm:text-[62px] lg:text-[72px]">
            Know if you fit before you apply.
          </h1>

          <p className="mt-6 max-w-[650px] text-[18px] font-medium leading-[1.6] text-muted sm:text-[20px]">
            Get an honest fit verdict, see what could hurt your candidacy, and
            generate application assets only after the strategy is clear.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/analyze">
              <Button size="lg" className="w-full sm:w-auto">
                Analyze my fit <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <span className="text-[13px] font-semibold text-muted">
              Private Phase 1 prototype · no login required
            </span>
          </div>

          <p className="mt-5 max-w-[600px] text-[13px] font-medium leading-[1.55] text-muted">
            Privacy note: use pasted CV text for this prototype. PDF upload and
            account history are intentionally not active yet.
          </p>
        </div>

        <Card className="animate-fadeUp p-5 sm:p-6 lg:p-7">
          <div className="rounded-[16px] bg-soft p-5">
            <div className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-muted">
              Fit verdict
            </div>
            <div className="mt-3 flex items-end justify-between gap-4">
              <div>
                <div className="text-[34px] font-black tracking-tighter2">
                  Stretch Fit
                </div>
                <div className="mt-1 text-[14px] font-semibold text-muted">
                  Score: 72 / 100
                </div>
              </div>
              <div className="rounded-full bg-warn/10 px-3 py-1.5 text-[12px] font-black uppercase tracking-[0.06em] text-warn">
                Apply with strategy
              </div>
            </div>
            <p className="mt-4 text-[14.5px] font-medium leading-[1.55] text-muted">
              Strong growth evidence, but direct marketplace operations and
              incentive-design proof may be screening risks.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {deliverables.slice(0, 4).map((item) => (
              <div key={item} className="rounded-[14px] border border-line p-4">
                <CheckCircle className="h-4 w-4 text-good" />
                <div className="mt-2 text-[14px] font-extrabold leading-[1.25]">
                  {item}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="mx-auto max-w-[1120px] px-6 pb-24 sm:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {landingSteps.map((step) => (
            <Card key={step.n} className="p-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-[13px] font-black text-white">
                {step.n}
              </div>
              <h2 className="mt-5 text-[20px] font-black tracking-[-0.02em]">
                {step.title}
              </h2>
              <p className="mt-2 text-[14.5px] font-medium leading-[1.55] text-muted">
                {step.body}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
