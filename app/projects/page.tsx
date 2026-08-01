import type { Metadata } from "next";
import { ProjectCard } from "@/components/project-card";
import { getAllProjects } from "@/lib/projects";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Projects",
  description: "Case studies: production RAG, multi-tenant SaaS, a freight ERP evolved over 4.5 years, and a licensed desktop product.",
};

const moreWork = [
  { title: "IBM z/OS mainframe port", note: "COBOL/CICS/DB2 airline system ported to IBM Cloud Wazi; demonstrated at a conference in Japan." },
  { title: "z/OS BPXBATCH consulting", note: "Root-caused a failing JCL cloud integration to EBCDIC encoding; delivered production JCL and a runbook." },
  { title: "AI-powered Google Ads platform", note: "Campaign management with ChatGPT-assisted suggestions, Angular Material UI, i18n, white-label." },
  { title: "Democratik campaign CRM", note: "Angular/Node.js platform: form builders, Leaflet maps, Pusher chat, Chrome extension, Gmail add-on." },
  { title: "FarmNet (internship)", note: "Agro-fintech platform connecting farmers, consumers, and investors — ASP.NET Core MVC." },
];

export default function ProjectsPage() {
  const projects = getAllProjects();
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-extrabold text-fg">Projects</h1>
      <p className="mt-2 max-w-2xl text-fg-muted">
        Four deep dives with architecture and measured results, plus smaller work worth a mention.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
      <h2 className="mt-14 mb-4 text-xl font-extrabold text-fg">More work</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {moreWork.map((w) => (
          <li key={w.title} className="rounded-xl border border-border p-4">
            <h3 className="font-bold text-fg">{w.title}</h3>
            <p className="mt-1 text-sm text-fg-muted">{w.note}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
