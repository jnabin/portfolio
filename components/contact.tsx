import { site } from "@/content/site";

const links = [
  { label: "Email", href: `mailto:${site.contact.email}` },
  { label: "LinkedIn", href: site.contact.linkedin },
  { label: "GitHub", href: site.contact.github },
  { label: "Upwork", href: site.contact.upwork },
];

export function Contact() {
  return (
    <div>
      <p className="max-w-xl text-fg-muted">
        Open to senior backend and AI engineering roles — remote, international. The fastest way to reach me is email.
      </p>
      <ul className="mt-5 flex flex-wrap gap-3">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="inline-block rounded-md border border-border bg-bg px-4 py-2 text-sm font-semibold text-fg hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
