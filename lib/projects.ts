import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

export type ProjectMeta = {
  slug: string;
  title: string;
  summary: string;
  role: string;
  period: string;
  stack: string[];
  metrics: { label: string; value: string }[];
  featured: boolean;
  order: number;
};

const DIR = join(process.cwd(), "content", "projects");

export function getAllProjects(): ProjectMeta[] {
  return readdirSync(DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const { data } = matter(readFileSync(join(DIR, f), "utf-8"));
      return { ...(data as Omit<ProjectMeta, "slug">), slug: f.replace(/\.mdx$/, "") };
    })
    .sort((a, b) => a.order - b.order);
}

export function getProjectBySlug(slug: string): { meta: ProjectMeta; content: string } | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  try {
    const raw = readFileSync(join(DIR, `${slug}.mdx`), "utf-8");
    const { data, content } = matter(raw);
    return { meta: { ...(data as Omit<ProjectMeta, "slug">), slug }, content };
  } catch {
    return null;
  }
}
