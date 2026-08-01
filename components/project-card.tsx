import Link from "next/link";
import type { ProjectMeta } from "@/lib/projects";

export function ProjectCard({ project }: { project: ProjectMeta }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col rounded-xl border border-border bg-bg p-5 transition hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <h3 className="text-lg font-bold text-fg group-hover:text-brand">{project.title}</h3>
      <p className="mt-2 flex-1 text-sm text-fg-muted">{project.summary}</p>
      <p className="mt-3 text-sm font-semibold text-brand">
        {project.metrics[0].label}: {project.metrics[0].value}
      </p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {project.stack.slice(0, 5).map((s) => (
          <li key={s} className="rounded-full bg-bg-subtle px-2.5 py-0.5 text-[11px] font-semibold text-fg-muted">
            {s}
          </li>
        ))}
      </ul>
    </Link>
  );
}
