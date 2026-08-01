export function Callout({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <aside className="my-6 rounded-lg border-l-4 border-brand bg-bg-subtle p-4 text-sm">
      {title && <p className="mb-1 font-bold text-fg">{title}</p>}
      <div className="text-fg-muted [&>p]:m-0">{children}</div>
    </aside>
  );
}
