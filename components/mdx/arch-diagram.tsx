export function ArchDiagram({ layers }: { layers: { label: string; items: string[] }[] }) {
  return (
    <figure className="my-6 overflow-x-auto">
      <div className="min-w-[480px] space-y-2">
        {layers.map((layer, i) => (
          <div key={layer.label}>
            <div className="flex items-stretch gap-2">
              <div className="flex w-28 shrink-0 items-center text-[11px] font-bold uppercase tracking-wide text-fg-muted">
                {layer.label}
              </div>
              <div className="flex flex-1 flex-wrap gap-2">
                {layer.items.map((item) => (
                  <div key={item} className="flex items-center rounded-md border border-border bg-bg px-3 py-2 text-xs font-medium text-fg">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            {i < layers.length - 1 && (
              <div className="my-1 ml-28 pl-2 text-fg-muted" aria-hidden>
                ↓
              </div>
            )}
          </div>
        ))}
      </div>
    </figure>
  );
}
