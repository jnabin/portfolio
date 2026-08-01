export function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-border bg-bg-subtle p-4">
      <div className="text-xl font-extrabold text-brand">{value}</div>
      <div className="mt-1 text-sm font-medium text-fg">{label}</div>
      {sub && <div className="mt-1 text-xs text-fg-muted">{sub}</div>}
    </div>
  );
}
