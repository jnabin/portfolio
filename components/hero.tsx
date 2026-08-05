import Image from "next/image";
import Link from "next/link";
import { IntroVideo } from "@/components/intro-video";
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
              className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-fg hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M2 8a2 2 0 0 1 2-2h4l2 2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z" />
              </svg>
              View projects
            </Link>
            <a
              href={site.cvPath}
              download
              className="inline-flex items-center gap-2 rounded-md border border-border bg-bg px-4 py-2 text-sm font-semibold text-fg hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14" />
              </svg>
              Download CV
            </a>
            <IntroVideo />
          </div>
        </div>
        <div className="flex flex-col items-center gap-3 self-center md:self-auto">
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
