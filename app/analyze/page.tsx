"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InputForm } from "@/components/InputForm";
import { LoadingScreen } from "@/components/LoadingScreen";
import { analyze } from "@/lib/api";
import { sampleAnalyzeRequest } from "@/lib/mock-data";
import type { AnalyzeRequest } from "@/lib/types";

const EMPTY_REQUEST: AnalyzeRequest = {
  cv: "",
  jobDescription: "",
  strengths: "",
  improvements: "",
  jobTitle: "",
  company: "",
};

export default function AnalyzePage() {
  const router = useRouter();
  const [values, setValues] = useState<AnalyzeRequest>(EMPTY_REQUEST);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateValues(patch: Partial<AnalyzeRequest>) {
    setValues((prev) => ({ ...prev, ...patch }));
  }

  function loadSample() {
    setValues(sampleAnalyzeRequest);
    setError(null);
  }

  async function handleSubmit() {
    setError(null);
    setLoading(true);

    try {
      const result = await analyze(values);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(`analysis:${result.jobId}`, JSON.stringify(result));
      }
      router.push(`/results/${result.jobId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <InputForm
      values={values}
      onChange={updateValues}
      onSubmit={handleSubmit}
      onLoadSample={loadSample}
      error={error}
    />
  );
}
