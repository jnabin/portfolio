import { site } from "@/content/site";

export function HowIRun() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {site.howIRun.map((c) => (
        <div key={c.title} className="flex flex-col rounded-xl border border-border bg-bg p-5">
          <h3 className="text-lg font-bold text-fg">{c.title}</h3>
          <p className="mt-2 flex-1 text-sm text-fg-muted">{c.body}</p>
          <p className="mt-3 text-sm font-semibold text-brand">{c.evidence}</p>
        </div>
      ))}
    </div>
  );
}
