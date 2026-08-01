export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-8 text-sm text-fg-muted sm:px-6">
        <p>© {new Date().getFullYear()} Jahangir Alam Nabin. Built with Next.js — statically generated.</p>
      </div>
    </footer>
  );
}
