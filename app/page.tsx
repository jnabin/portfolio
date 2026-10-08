import { Hero } from "@/components/hero";
import { ProjectCard } from "@/components/project-card";
import { EvidencePanel } from "@/components/evidence-panel";
import { Section } from "@/components/section";
import { getAllProjects } from "@/lib/projects";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { SkillsGrid } from "@/components/skills-grid";
import { Beyond } from "@/components/beyond";
import { HowIRun } from "@/components/how-i-run";
import { MainframeHighlights } from "@/components/mainframe-highlights";
import { Contact } from "@/components/contact";
import { Testimonials } from "@/components/testimonials";

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
      <Section id="clients" title="What clients say">
        <Testimonials />
      </Section>
      <Section id="evidence" title="Evidence">
        <EvidencePanel />
      </Section>
      <Section id="how-i-run" title="How I run projects — beyond the code">
        <HowIRun />
      </Section>
      <Section id="mainframe" title="Mainframe & z/OS">
        <MainframeHighlights />
      </Section>
      <Section id="experience" title="Experience">
        <ExperienceTimeline />
      </Section>
      <Section id="skills" title="Skills">
        <SkillsGrid />
      </Section>
      <Section id="beyond" title="Beyond the day job">
        <Beyond />
      </Section>
      <Section id="contact" title="Contact">
        <Contact />
      </Section>
    </>
  );
}
