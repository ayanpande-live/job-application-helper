import { ResultsDashboard } from "@/components/ResultsDashboard";

type ResultsPageProps = {
  params: Promise<{
    jobId: string;
  }>;
};

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { jobId } = await params;

  return <ResultsDashboard jobId={jobId} />;
}