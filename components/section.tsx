export function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="mx-auto max-w-5xl scroll-mt-20 px-4 py-14 sm:px-6">
      <h2 id={`${id}-h`} className="mb-6 text-2xl font-extrabold text-fg">
        {title}
      </h2>
      {children}
    </section>
  );
}
