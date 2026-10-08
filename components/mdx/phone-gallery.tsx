type Shot = { src: string; alt: string; caption: string };

export function PhoneGallery({ shots }: { shots: Shot[] }) {
  return (
    <div className="my-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
      {shots.map((s) => (
        <figure key={s.src}>
          <div className="overflow-hidden rounded-2xl border border-border bg-bg-subtle">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.src} alt={s.alt} width={360} height={800} loading="lazy" className="block h-auto w-full" />
          </div>
          <figcaption className="mt-2 text-center text-xs text-fg-muted">{s.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
