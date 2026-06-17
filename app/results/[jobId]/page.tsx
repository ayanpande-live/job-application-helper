import { ResultsDashboard } from "@/components/ResultsDashboard";

export default function ResultsPage({ params }: { params: { jobId: string } }) {
  return <ResultsDashboard jobId={params.jobId} />;
}
