"use client";

import { useEffect, useState } from "react";
import { Wordmark } from "@/components/ui/Logo";
import { loadingSteps } from "@/lib/mock-data";

export function LoadingScreen() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((prev) => Math.min(prev + 1, loadingSteps.length - 1));
    }, 650);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-canvas">
      <header className="mx-auto w-full max-w-[1120px] px-6 py-6 sm:px-8">
        <Wordmark />
      </header>
      <section className="mx-auto flex w-full max-w-[720px] flex-1 flex-col items-center justify-center px-6 pb-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-line bg-surface shadow-card">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-accent" />
        </div>
        <h1 className="mt-8 text-[34px] font-black tracking-tighter2 sm:text-[44px]">
          Building your fit strategy.
        </h1>
        <p className="mt-3 max-w-[520px] text-[16px] font-medium leading-[1.6] text-muted">
          We are checking your match evidence, risk areas and the best way to
          position your application.
        </p>

        <div className="mt-9 w-full rounded-card border border-line bg-surface p-5 text-left shadow-card">
          {loadingSteps.map((step, i) => {
            const done = i < active;
            const current = i === active;
            return (
              <div
                key={step}
                className={`flex items-center gap-3 border-line py-3 first:pt-0 last:pb-0 ${
                  i !== loadingSteps.length - 1 ? "border-b" : ""
                }`}
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-black ${
                    done || current
                      ? "bg-accent text-white"
                      : "bg-soft text-muted"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </div>
                <div
                  className={`text-[14.5px] font-bold ${
                    done || current ? "text-ink" : "text-muted"
                  }`}
                >
                  {step}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
