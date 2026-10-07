import { createFileRoute } from "@tanstack/react-router";
import { ReportApp } from "@/components/report-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <ReportApp />;
}
