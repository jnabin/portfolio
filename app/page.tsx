import { Hero } from "@/components/hero";
import { ProjectCard } from "@/components/project-card";
import { EvidencePanel } from "@/components/evidence-panel";
import { Section } from "@/components/section";
import { getAllProjects } from "@/lib/projects";

export const dynamic = "error";

export default function Home() {
  const featured = getAllProjects().filter((p) => p.featured);
  return (
    <>
      <Hero />
      <Section id="projects" title="Case studies">
        <div className="grid gap-4 sm:grid-cols-2">
          {featured.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </Section>
      <Section id="evidence" title="Evidence">
        <EvidencePanel />
      </Section>
    </>
  );
}
