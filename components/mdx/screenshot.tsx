export function Screenshot({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="my-6">
      <div className="overflow-hidden rounded-lg border border-border bg-bg-subtle">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" className="block w-full" />
      </div>
      {caption && <figcaption className="mt-2 text-center text-xs text-fg-muted">{caption}</figcaption>}
    </figure>
  );
}
