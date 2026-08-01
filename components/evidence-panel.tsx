import { site } from "@/content/site";

export function EvidencePanel() {
  return (
    <div className="rounded-xl bg-panel p-6 font-mono text-sm text-panel-fg">
      <p className="mb-4 text-xs uppercase tracking-widest text-panel-accent">Verified numbers, not adjectives</p>
      <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
        {site.evidence.map((e) => (
          <div key={e.label} className="flex flex-col gap-0.5">
            <dt className="text-xs text-panel-fg/70">{e.label}</dt>
            <dd className="font-bold text-panel-accent">{e.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
