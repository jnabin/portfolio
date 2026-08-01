import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";

export function Hero() {
  return (
    <section className="border-b border-border bg-bg-subtle">
      <div className="mx-auto flex max-w-5xl flex-col-reverse items-start gap-8 px-4 py-14 sm:px-6 md:flex-row md:items-center md:py-20">
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold text-fg sm:text-4xl">{site.name}</h1>
          <p className="mt-1 text-lg font-bold text-brand">{site.headline}</p>
          <p className="mt-4 max-w-xl text-fg-muted">{site.intro}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-fg hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              View projects
            </Link>
            <a
              href={site.cvPath}
              download
              className="rounded-md border border-border bg-bg px-4 py-2 text-sm font-semibold text-fg hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Download CV
            </a>
          </div>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/headshot.jpg"
            alt="Portrait of Jahangir Alam Nabin"
            width={160}
            height={160}
            priority
            className="rounded-full border-4 border-bg shadow-md"
          />
          <div className="rounded-lg border border-border bg-bg px-4 py-2 text-center">
            <div className="text-lg font-extrabold text-brand">{site.heroStat.value}</div>
            <div className="text-xs text-fg-muted">{site.heroStat.label}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
