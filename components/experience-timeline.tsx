import { site } from "@/content/site";

export function ExperienceTimeline() {
  return (
    <ol className="relative space-y-8 border-l border-border pl-6">
      {site.experience.map((job) => (
        <li key={`${job.company}-${job.dates}`} className="relative">
          <span className="absolute -left-[1.85rem] top-1.5 h-3 w-3 rounded-full border-2 border-bg bg-brand" aria-hidden />
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h3 className="font-bold text-fg">
              {job.title} <span className="font-semibold text-brand">· {job.company}</span>
            </h3>
            <p className="text-sm text-fg-muted">{job.dates}</p>
          </div>
          {job.note && <p className="mt-0.5 text-xs italic text-fg-muted">{job.note}</p>}
          <ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm text-fg-muted">
            {job.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
