import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx";
import { MetricCard } from "@/components/mdx/metric-card";
import { StackChips } from "@/components/mdx/stack-chips";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";

export const dynamic = "error";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.meta.title,
    description: project.meta.summary,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: { title: project.meta.title, description: project.meta.summary, images: [`/og/${slug}.png`] },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const { content } = await compileMDX({ source: project.content, components: mdxComponents });
  const { meta } = project;

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <Link href="/projects" className="text-sm font-semibold text-brand hover:underline">
        ← All projects
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold text-fg">{meta.title}</h1>
      <p className="mt-3 text-fg-muted">{meta.summary}</p>
      <dl className="mt-4 space-y-1 text-sm text-fg-muted">
        <div>
          <dt className="inline font-semibold text-fg">Role: </dt>
          <dd className="inline">{meta.role}</dd>
        </div>
        <div>
          <dt className="inline font-semibold text-fg">Period: </dt>
          <dd className="inline">{meta.period}</dd>
        </div>
      </dl>
      <div className="mt-4">
        <StackChips items={[...meta.stack]} />
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {meta.metrics.map((m) => (
          <MetricCard key={m.label} label={m.label} value={m.value} />
        ))}
      </div>
      <div className="prose-portfolio mt-10">{content}</div>
    </article>
  );
}
