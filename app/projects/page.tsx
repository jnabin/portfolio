import type { Metadata } from "next";
import { ProjectCard } from "@/components/project-card";
import { getAllProjects } from "@/lib/projects";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Projects",
  description: "Case studies: production RAG with MCP external data, a driver app and mobile BFF, an Android + Go product, multi-tenant SaaS, a freight ERP evolved over 4.5 years, a licensed desktop product, and IBM z/OS mainframe work.",
  alternates: { canonical: "/projects" },
  openGraph: { images: ["/og/projects.png"] },
};

const moreWork = [
  { title: "AI-powered Google Ads platform", note: "Campaign management with ChatGPT-assisted suggestions, Angular Material UI, i18n, white-label." },
  { title: "Yodlee financial-data integration", note: "Clean Architecture/CQRS .NET service integrating Yodlee aggregation APIs with token-based auth and normalized PostgreSQL persistence." },
  { title: "Full-stack realtime chat platform", note: "Self-authored end to end: Angular + Material front end, Node/Express + MySQL API, Pusher realtime — DMs, groups, threads, reactions, file uploads." },
  { title: "AI voice calling for a real-estate CRM", note: "Angular embed for Follow Up Boss placing outbound Retell AI voice-agent calls with dynamic LLM variables, writing outcomes back to the CRM." },
  { title: "LLM-powered website extraction API", note: ".NET 9 Web API pairing AngleSharp parsing with the OpenAI API to return structured business data from any URL." },
  { title: "Workplace-safety signage SaaS", note: "Maintained and extended an ISO 7010 safety-poster platform — Angular Universal SSR, NgRx, drag-and-drop poster editor, Stripe subscriptions." },
  { title: "Esports wagering platform", note: "Full-stack development on a 1v1/5v5 matchmaking product — Node/Express + MongoDB, Socket.IO realtime, token economy, twin Angular player/admin apps." },
  { title: "Member portal & campaign websites", note: "Angular self-service portal (memberships, renewals, recurring donations, event tickets) plus bilingual campaign sites for Canadian politicians." },
  { title: "Appointment scheduler", note: "Angular + Material calendar booking app with lazy-loaded feature modules and reactive forms, deployed on Firebase Hosting." },
  { title: "Review-request micro-SaaS", note: "ASP.NET Core MVC tool giving businesses branded landing pages that funnel customers to Google and Facebook reviews." },
  { title: "FarmNet (internship)", note: "Agro-fintech platform connecting farmers, consumers, and investors — ASP.NET Core MVC." },
];

export default function ProjectsPage() {
  const projects = getAllProjects();
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-extrabold text-fg">Projects</h1>
      <p className="mt-2 max-w-2xl text-fg-muted">
        Deep dives with architecture and measured results — including two IBM z/OS engagements — plus smaller work worth a mention.
      </p>
      <h2 className="mt-10 mb-4 text-xl font-extrabold text-fg">Case studies</h2>
      <div className="grid gap-4 sm:grid-cols-2">
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
