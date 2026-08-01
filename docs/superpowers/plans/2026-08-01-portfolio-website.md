# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and verify Jahangir Nabin's static portfolio site (Next.js + Tailwind, navy brand, dark toggle, 4 MDX case studies) ready for Vercel import.

**Architecture:** Fully statically generated Next.js App Router site. All copy lives in `content/site.ts` (typed) and `content/projects/*.mdx` (frontmatter + prose, rendered via `next-mdx-remote/rsc`). Only two client components (theme toggle, mobile menu). Vitest guards content integrity and anonymization.

**Tech Stack:** Next.js 15 (App Router, TS strict), Tailwind CSS v4, next-themes, next-mdx-remote v5, gray-matter, Vitest, satori + @resvg/resvg-js (build-time OG images).

## Global Constraints

- Working directory: `C:\projects\portfolio` (existing git repo, branch `main`). Shell examples are Git Bash; quote all paths.
- Node 22 / npm 10 (verified installed). npm can be slow on this machine — use 300000ms+ timeouts for installs.
- **Anonymization (hard):** the automotive client is never named — not in prose, slugs, file/alt/EXIF names, code comments, or git commit messages. Only "a global automotive client". No employer-internal codenames. Metrics never exceed the 2026 CV.
- Brand: navy `#1F4E79` light theme; lightened navy `#7fb1e0` dark theme; all text/background pairs must pass WCAG AA.
- Nav brand text: "Jahangir Nabin" (mobile) / "Jahangir Nabin · Software Engineer" (≥sm). Never bare "JN".
- Every route statically generated; no API routes, no server actions, no runtime env vars.
- Site URL constant: `https://portfolio-jnabin.vercel.app` in `content/site.ts` (`SITE_URL`) — update once after Vercel assigns the real domain.
- Commits end with: `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`

---

### Task 1: Scaffold Next.js app with Vitest

**Files:**
- Create: Next.js scaffold at repo root (`app/`, `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`)
- Create: `vitest.config.ts`
- Modify: `package.json` (add `test` script)

**Interfaces:**
- Produces: working `npm run dev|build|lint` and `npm test` (vitest). Later tasks assume Tailwind v4 via `@import "tailwindcss"` in `app/globals.css`.

- [ ] **Step 1: Scaffold into the existing repo**

```bash
cd /c/projects/portfolio
npx --yes create-next-app@15 . --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --skip-install
npm install
```

(`--skip-install` then `npm install` keeps one long install step; expect several minutes.)

- [ ] **Step 2: Verify scaffold builds**

Run: `npm run build`
Expected: build succeeds; routes `/` and `/_not-found` listed as static (○).

- [ ] **Step 3: Add Vitest**

```bash
npm install -D vitest@^3
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
  },
});
```

In `package.json` scripts add: `"test": "vitest run"`.

- [ ] **Step 4: Verify vitest runs (no tests yet)**

Run: `npx vitest run --passWithNoTests`
Expected: exits 0, "No test files found".
Then set the script to keep strictness later: leave `"test": "vitest run"` as-is (tests arrive in Task 3).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 15 + Tailwind v4 + Vitest

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Design tokens, fonts, theme toggle, Nav + Footer shell

**Files:**
- Modify: `app/globals.css` (replace entirely)
- Modify: `app/layout.tsx` (replace entirely)
- Modify: `app/page.tsx` (temporary shell)
- Create: `components/theme-provider.tsx`, `components/theme-toggle.tsx`, `components/nav.tsx`, `components/footer.tsx`

**Interfaces:**
- Consumes: Tailwind v4 from Task 1.
- Produces: semantic color utilities `bg-bg`, `bg-bg-subtle`, `text-fg`, `text-fg-muted`, `text-brand`, `bg-brand`, `text-brand-fg`, `border-border`, `bg-panel`, `text-panel-fg`, `text-panel-accent`; fonts `font-sans`, `font-mono`; `<Nav/>`, `<Footer/>` used by every page. Container convention: `mx-auto max-w-5xl px-4 sm:px-6`.

- [ ] **Step 1: Install next-themes**

```bash
npm install next-themes@^0.4
```

- [ ] **Step 2: Replace `app/globals.css`**

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

:root {
  --bg: #ffffff;
  --bg-subtle: #f3f6fa;
  --fg: #111827;
  --fg-muted: #4b5563;
  --brand: #1f4e79;
  --brand-fg: #ffffff;
  --border: #e2e8f0;
  --panel: #0f2740;
  --panel-fg: #dbe7f4;
  --panel-accent: #7ee0a3;
}

.dark {
  --bg: #0b1220;
  --bg-subtle: #111a2c;
  --fg: #e5edf7;
  --fg-muted: #9fb0c7;
  --brand: #7fb1e0;
  --brand-fg: #0b1220;
  --border: #22304a;
  --panel: #0f2740;
  --panel-fg: #dbe7f4;
  --panel-accent: #7ee0a3;
}

@theme inline {
  --color-bg: var(--bg);
  --color-bg-subtle: var(--bg-subtle);
  --color-fg: var(--fg);
  --color-fg-muted: var(--fg-muted);
  --color-brand: var(--brand);
  --color-brand-fg: var(--brand-fg);
  --color-border: var(--border);
  --color-panel: var(--panel);
  --color-panel-fg: var(--panel-fg);
  --color-panel-accent: var(--panel-accent);
  --font-sans: var(--font-inter);
  --font-mono: var(--font-jbmono);
}

html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}

body {
  background: var(--bg);
  color: var(--fg);
}
```

- [ ] **Step 3: Create `components/theme-provider.tsx`**

```tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
}
```

- [ ] **Step 4: Create `components/theme-toggle.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <span className="inline-block h-9 w-9" aria-hidden />;
  }

  const dark = resolvedTheme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-fg-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      {dark ? (
        <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" />
        </svg>
      ) : (
        <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      )}
    </button>
  );
}
```

- [ ] **Step 5: Create `components/nav.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/#experience", label: "Experience" },
  { href: "/#contact", label: "Contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-bold text-fg" onClick={() => setOpen(false)}>
          Jahangir Nabin
          <span className="hidden text-fg-muted sm:inline"> · Software Engineer</span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-6 sm:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-fg-muted hover:text-fg">
              {l.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border"
          >
            <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav aria-label="Mobile" className="border-t border-border sm:hidden">
          <div className="mx-auto flex max-w-5xl flex-col px-4 py-2">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-2 text-sm text-fg-muted hover:text-fg">
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
```

- [ ] **Step 6: Create `components/footer.tsx`**

```tsx
export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-8 text-sm text-fg-muted sm:px-6">
        <p>© {new Date().getFullYear()} Jahangir Alam Nabin. Built with Next.js — statically generated.</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 7: Replace `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jbmono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jbmono" });

export const metadata: Metadata = {
  title: {
    default: "Jahangir Nabin — Senior Software Engineer",
    template: "%s — Jahangir Nabin",
  },
  description:
    ".NET, distributed systems, and applied AI. Senior software engineer leading teams and shipping production RAG systems.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jbmono.variable} font-sans antialiased`}>
        <ThemeProvider>
          <Nav />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 8: Temporary shell in `app/page.tsx`** (replaced in Task 5)

```tsx
export const dynamic = "error";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-extrabold text-brand">Design system shell</h1>
      <p className="mt-2 text-fg-muted">Tokens, fonts, nav, footer, and theme toggle live.</p>
    </div>
  );
}
```

- [ ] **Step 9: Verify in browser**

Run: `npm run build` → expected: all routes static, no errors.
Run: `npm run dev`, open `http://localhost:3000` (use the app's Browser pane via `preview_start` if driving from Claude Code).
Check: navy heading; toggle flips light/dark with no flash; brand shows suffix on desktop, name-only on narrow width; mobile menu opens/closes. Stop dev server.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: design tokens, fonts, dark mode, nav and footer

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Typed site content + integrity & anonymization tests (TDD)

**Files:**
- Create: `tests/content.test.ts`, `tests/anonymization.test.ts`
- Create: `content/site.ts`

**Interfaces:**
- Produces: `content/site.ts` exporting `SITE_URL: string`, `site` object with fields used by every section component: `name`, `headline`, `intro`, `heroStat {value,label}`, `cvPath`, `contact {email,linkedin,github,upwork}`, `evidence: {label,value}[]`, `experience: {title,company,dates,note?,lines:[string,string]}[]`, `skills: {category,items}[]`, `beyond: string[]`, `education {degree,school,detail}`, `languages: string`.

- [ ] **Step 1: Write failing content test — `tests/content.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { SITE_URL, site } from "../content/site";

describe("site content integrity", () => {
  it("has the core identity fields", () => {
    expect(site.name).toBe("Jahangir Alam Nabin");
    expect(site.headline).toContain("Senior Software Engineer");
    expect(SITE_URL).toMatch(/^https:\/\//);
  });

  it("has exactly 6 experience entries in reverse-chronological order", () => {
    expect(site.experience).toHaveLength(6);
    expect(site.experience[0].company).toContain("Brain Station 23");
    expect(site.experience[5].company).toContain("Code Source");
  });

  it("has 6 skill categories and complete contact links", () => {
    expect(site.skills).toHaveLength(6);
    expect(site.contact.email).toContain("@");
    expect(site.contact.linkedin).toContain("linkedin.com");
    expect(site.contact.github).toContain("github.com");
    expect(site.contact.upwork).toContain("upwork.com");
  });

  it("evidence panel has at least 5 verified stats", () => {
    expect(site.evidence.length).toBeGreaterThanOrEqual(5);
  });
});
```

- [ ] **Step 2: Write the anonymization gate — `tests/anonymization.test.ts`**

Forbidden strings are built from fragments so this file never contains them verbatim (it would match itself otherwise). The scan covers all git-tracked files except this test, plus all commit messages.

```ts
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const FORBIDDEN = [
  ["ni", "ssan"].join(""),
  ["qash", "qai"].join(""),
  ["nd", "g-"].join(""),
  ["cm", "cg"].join(""),
  ["c-", "app"].join(""),
].map((s) => s.toLowerCase());

const SELF = "tests/anonymization.test.ts";

function trackedFiles(): string[] {
  return execSync("git ls-files", { encoding: "utf-8" })
    .split("\n")
    .filter((f) => f && f !== SELF && !f.endsWith(".png") && !f.endsWith(".jpg") && !f.endsWith(".pdf") && !f.endsWith(".ico"));
}

describe("anonymization gate", () => {
  it("no forbidden client strings in tracked text files", () => {
    const hits: string[] = [];
    for (const f of trackedFiles()) {
      const text = readFileSync(f, "utf-8").toLowerCase();
      for (const word of FORBIDDEN) {
        if (text.includes(word)) hits.push(`${f}: ${word}`);
      }
    }
    expect(hits).toEqual([]);
  });

  it("no forbidden client strings in commit messages", () => {
    const log = execSync("git log --all --format=%B", { encoding: "utf-8" }).toLowerCase();
    for (const word of FORBIDDEN) {
      expect(log.includes(word), `commit log contains "${word}"`).toBe(false);
    }
  });
});
```

- [ ] **Step 3: Run tests to verify the content test fails**

Run: `npm test`
Expected: `tests/content.test.ts` FAILS (cannot resolve `../content/site`); anonymization test PASSES.

- [ ] **Step 4: Create `content/site.ts`** (all copy verbatim — this is the single source of words)

```ts
export const SITE_URL = "https://portfolio-jnabin.vercel.app";

export const site = {
  name: "Jahangir Alam Nabin",
  headline: "Senior Software Engineer — .NET, Distributed Systems & Applied AI",
  intro:
    "I build backend platforms and AI systems that ship — from multi-tenant SaaS to a production-grade RAG chatbot for a global automotive client. Currently leading a 6-developer team at Brain Station 23.",
  heroStat: { value: "100%", label: "Upwork Job Success · 2,390+ hrs" },
  cvPath: "/cv/Jahangir_Alam_Nabin_CV.pdf",
  contact: {
    email: "jahangirnabin2@gmail.com",
    linkedin: "https://www.linkedin.com/in/jahangir-nabin",
    github: "https://github.com/jnabin",
    upwork: "https://www.upwork.com/freelancers/~014a55b53d36d618d6",
  },
  evidence: [
    { label: "RAG keyword recall@100", value: "96.9% → 100%" },
    { label: "Disambiguation win-rate", value: "100% across 27 cases" },
    { label: "SLO release gates", value: "≥70% answers · ≥80% citations · ≤2% errors" },
    { label: "REST endpoints across platforms", value: "1,400+" },
    { label: "External integrations", value: "25+ logistics & accounting partners" },
    { label: "One product, 4.5 years", value: "3,600+ commits, top contributor" },
  ],
  experience: [
    {
      title: "Senior Software Engineer",
      company: "Brain Station 23 PLC, Dhaka",
      dates: "Jul 2025 – Present",
      lines: [
        "Lead a 6-developer team; presales, requirement analysis, effort estimation, releases.",
        "Architect a multi-tenant compliance SaaS and an automotive AI platform with a RAG chatbot.",
      ],
    },
    {
      title: "Software Engineer — .NET & Angular",
      company: "SkyTech Solutions (Codezzi), Dhaka",
      dates: "Jan 2025 – Jul 2025",
      lines: [
        "CRM features in .NET Core and Angular; ChatGPT, Stripe, SES, and Google Ads integrations.",
        "WinForms + Selenium desktop data-collection product with licensing.",
      ],
    },
    {
      title: "Software Engineer — .NET & Angular",
      company: "Freightoscope, FL, USA (Remote)",
      dates: "Jan 2022 – Present",
      note: "Full-time to Feb 2025; part-time consulting since.",
      lines: [
        "Freight-forwarding ERP: 159 controllers, 1,000+ endpoints, 526 Angular components.",
        "25+ integrations, rate lifecycle, Redis/SQL performance, 5 CI/CD pipelines.",
      ],
    },
    {
      title: "Software Engineer — .NET (Part-time)",
      company: "Quadiro Technologies LLP (Remote)",
      dates: "Nov 2021 – Jun 2022",
      lines: [
        "Yodlee financial-data integration in a Clean Architecture/CQRS application.",
        "Repository/unit-of-work patterns with xUnit/NSubstitute API tests.",
      ],
    },
    {
      title: "Full-Stack Developer — Node.js & Angular",
      company: "Democratik, Laval, Canada (Remote)",
      dates: "Dec 2020 – Jan 2022",
      lines: [
        "CRM and campaign features: forms, email builders, Leaflet maps, Pusher chat.",
        "Chrome extension and Gmail add-on; guided 2 intern developers.",
      ],
    },
    {
      title: "Software Developer Intern — .NET",
      company: "Code Source, Dhaka",
      dates: "Sep 2020 – Dec 2020",
      lines: [
        "FarmNet agro-fintech platform in ASP.NET Core MVC, EF Core, SQL Server.",
        "Database design and responsive UI from Figma designs.",
      ],
    },
  ],
  skills: [
    { category: "Languages", items: ["C#", "Python", "TypeScript", "JavaScript", "SQL", "Dart"] },
    { category: "Backend & Frontend", items: [".NET 8/9/10", "ASP.NET Core", "FastAPI", "Node.js", "Angular", "React/Next.js", "Flutter", "SignalR", "REST APIs", "RxJS"] },
    { category: "AI & LLM Engineering", items: ["RAG", "LLM integration", "Generative AI", "Prompt engineering", "LangChain", "Semantic Kernel", "Cohere reranking", "Qdrant", "pgvector", "Hybrid search (BM25, RRF)"] },
    { category: "Architecture & Messaging", items: ["Clean Architecture", "CQRS (MediatR)", "Modular monoliths", "Microservices", "Domain-Driven Design", "Kafka", "MassTransit", "Transactional outbox", "SOLID"] },
    { category: "Data & Cloud", items: ["PostgreSQL", "SQL Server", "Redis", "EF Core", "Dapper", "AWS (EC2, S3, ECS Fargate, RDS)", "Azure (Functions, Blob, DevOps)", "Docker", "GitHub Actions", "IBM Cloud"] },
    { category: "Quality & Security", items: ["xUnit", "Testcontainers", "Architecture tests", "pytest", "SonarQube", "Serilog/Seq", "Prometheus", "Keycloak", "SSO/OIDC", "JWT", "RBAC", "Agile/Scrum", "AI-assisted engineering"] },
  ],
  beyond: [
    "Ported and extended a COBOL/CICS/DB2 airline-booking system to IBM Cloud Wazi (z/OS 3.1, CICS TS 6.2, DB2 v13) — demonstrated at a conference in Japan.",
    "Independent freelance record: 100% Job Success across 20 contracts and 2,390+ logged hours.",
    "Ship complete products solo: a licensed cross-platform desktop app with fail-closed Ed25519 entitlements.",
  ],
  education: {
    degree: "BSc in Computer Science and Engineering",
    school: "American International University-Bangladesh",
    detail: "CGPA 3.91/4.00 · Magna Cum Laude · Dean's List · Mar 2020",
  },
  languages: "English (fluent) · Bengali (native)",
} as const;

export type Site = typeof site;
```

- [ ] **Step 5: Run tests to verify all pass**

Run: `npm test`
Expected: both test files PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: typed site content with integrity and anonymization tests

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: MDX pipeline, case-study components, first case study (TDD)

**Files:**
- Create: `lib/projects.ts`, `tests/projects.test.ts`
- Create: `components/mdx/metric-card.tsx`, `components/mdx/stack-chips.tsx`, `components/mdx/callout.tsx`, `components/mdx/arch-diagram.tsx`, `components/mdx/index.ts`
- Create: `content/projects/automotive-rag-chatbot.mdx`

**Interfaces:**
- Produces: `getAllProjects(): ProjectMeta[]` (sorted by `order`), `getProjectBySlug(slug: string): { meta: ProjectMeta; content: string } | null`, `type ProjectMeta = { slug; title; summary; role; period; stack: string[]; metrics: { label: string; value: string }[]; featured: boolean; order: number }`. MDX component map `mdxComponents` exported from `components/mdx/index.ts` with `MetricCard {label,value,sub?}`, `StackChips {items: string[]}`, `Callout {title?, children}`, `ArchDiagram {layers: {label: string; items: string[]}[]}`.

- [ ] **Step 1: Install MDX deps**

```bash
npm install next-mdx-remote@^5 gray-matter@^4
```

- [ ] **Step 2: Write failing loader test — `tests/projects.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { getAllProjects, getProjectBySlug } from "../lib/projects";

describe("projects loader", () => {
  it("loads projects sorted by order with complete frontmatter", () => {
    const all = getAllProjects();
    expect(all.length).toBeGreaterThanOrEqual(1);
    for (const p of all) {
      expect(p.slug).toMatch(/^[a-z0-9-]+$/);
      expect(p.title.length).toBeGreaterThan(5);
      expect(p.summary.length).toBeGreaterThan(20);
      expect(p.stack.length).toBeGreaterThanOrEqual(3);
      expect(p.metrics.length).toBeGreaterThanOrEqual(2);
    }
    const orders = all.map((p) => p.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it("returns null for unknown slug and content for a known one", () => {
    expect(getProjectBySlug("does-not-exist")).toBeNull();
    const first = getAllProjects()[0];
    const loaded = getProjectBySlug(first.slug);
    expect(loaded?.content).toContain("## ");
  });
});
```

Run: `npm test` → expected: FAIL (cannot resolve `../lib/projects`).

- [ ] **Step 3: Create `lib/projects.ts`**

```ts
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
```

- [ ] **Step 4: Create the MDX components**

`components/mdx/metric-card.tsx`:

```tsx
export function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-border bg-bg-subtle p-4">
      <div className="text-xl font-extrabold text-brand">{value}</div>
      <div className="mt-1 text-sm font-medium text-fg">{label}</div>
      {sub && <div className="mt-1 text-xs text-fg-muted">{sub}</div>}
    </div>
  );
}
```

`components/mdx/stack-chips.tsx`:

```tsx
export function StackChips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item} className="rounded-full bg-bg-subtle px-3 py-1 text-xs font-semibold text-brand">
          {item}
        </li>
      ))}
    </ul>
  );
}
```

`components/mdx/callout.tsx`:

```tsx
export function Callout({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <aside className="my-6 rounded-lg border-l-4 border-brand bg-bg-subtle p-4 text-sm">
      {title && <p className="mb-1 font-bold text-fg">{title}</p>}
      <div className="text-fg-muted [&>p]:m-0">{children}</div>
    </aside>
  );
}
```

`components/mdx/arch-diagram.tsx` (pure HTML/CSS layered diagram, theme-aware):

```tsx
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
```

`components/mdx/index.ts`:

```ts
import { ArchDiagram } from "./arch-diagram";
import { Callout } from "./callout";
import { MetricCard } from "./metric-card";
import { StackChips } from "./stack-chips";

export const mdxComponents = { ArchDiagram, Callout, MetricCard, StackChips };
export { ArchDiagram, Callout, MetricCard, StackChips };
```

- [ ] **Step 5: Create `content/projects/automotive-rag-chatbot.mdx`** (full content)

```mdx
---
title: "RAG Chatbot for a Global Automotive Client"
summary: "A production-grade retrieval-augmented generation backend answering vehicle owner-manual questions — hybrid retrieval, four-layer caching, and releases gated on measured quality SLOs."
role: "Sole author of the Python/FastAPI backend; also built the .NET content platform feeding it"
period: "2025 – 2026, Brain Station 23"
stack: ["Python", "FastAPI", "Qdrant", "PostgreSQL", "Redis", "OpenAI", "Cohere", "BM25", "SSE"]
metrics:
  - { label: "Keyword recall@100", value: "96.9% → 100%" }
  - { label: "Disambiguation win-rate", value: "100% (27 cases)" }
  - { label: "Cache layers", value: "4 + singleflight" }
featured: true
order: 1
---

## Context

A global automotive client needed drivers to get accurate answers from vehicle owner manuals — hundreds of pages per model, safety-critical content, multiple languages. Wrong answers about towing capacity or warning lights are not acceptable, so answer quality had to be measured, not assumed.

<Callout title="My role">
  I sole-authored the Python/FastAPI RAG backend and designed its Clean Architecture with CI-enforced import boundaries. I also built the .NET content platform that feeds manual content into ingestion, and wired the two together with a live contract test.
</Callout>

## Architecture

<ArchDiagram
  layers={[
    { label: "Ingestion", items: ["Hierarchical chunking", "Entity extraction", "Batch embeddings", "Idempotent jobs"] },
    { label: "Indexes", items: ["Dense vectors (Qdrant)", "Sparse BM25", "Entity keyword index"] },
    { label: "Retrieval", items: ["Parallel dense + BM25", "RRF fusion", "Cohere rerank", "Confidence routing"] },
    { label: "Serving", items: ["Structured answers + citations", "SSE streaming", "4-layer Redis cache", "Conversation memory"] },
  ]}
/>

Queries fan out to dense and sparse search in parallel; results merge with reciprocal-rank fusion before reranking. Low-confidence retrievals route to clarification instead of hallucinated answers. Every answer carries validated citations back to manual sections.

## Key decisions

**Hybrid retrieval over pure vectors.** Owner manuals are full of exact tokens — part numbers, warning-light names, acronyms — that embeddings blur. Adding BM25 sparse retrieval and an exact-entity keyword index lifted recall@100 from 96.9% to 100% on the evaluation set, and disambiguation prompts now win 100% of 27 acronym-collision cases.

**Four cache layers with singleflight.** Embedding reuse, retrieval results, full answers, and conversation context cache independently in Redis with distinct TTLs. Singleflight locks collapse concurrent identical requests into one upstream call — the difference between a cost spike and a flat line when many drivers ask the same question after a recall notice.

**Releases gated on SLOs.** A behavioral evaluation harness runs before every release: at least 70% standard-answer rate, at least 80% citation coverage, at most 2% error rate. The suite spans ~196 backend tests plus architecture-boundary checks, so quality regressions block the release instead of reaching drivers.

## Results

Verified by the automated evaluation harness: 100% keyword recall@100, 100% disambiguation win-rate, structured answers with citation validation, SSE time-to-first-token designed against explicit latency targets. Multi-tenant-ready isolation is in place for rollout beyond the pilot.

## What I'd do differently

Start the evaluation harness on day one rather than mid-project — every retrieval decision became faster to make once changes could be scored against a fixed question set within minutes.
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm test`
Expected: all three test files PASS (content, anonymization, projects).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: MDX pipeline, case-study components, first case study

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Remaining three case studies

**Files:**
- Create: `content/projects/tpsaas-compliance-platform.mdx`, `content/projects/freightoscope-platform.mdx`, `content/projects/bizxtract-licensing.mdx`

**Interfaces:**
- Consumes: frontmatter schema from Task 4 (`ProjectMeta`). All four files must have `featured: true` and unique `order` 1–4.

- [ ] **Step 1: Create `content/projects/tpsaas-compliance-platform.mdx`**

```mdx
---
title: "Multi-Tenant Compliance SaaS at 400-Endpoint Scale"
summary: "A vendor-risk and compliance platform — tenant isolation with EF Core global query filters, CQRS across 54 feature modules, multi-IdP SSO, and Stripe subscription billing."
role: "Architect and top contributor (~45% of 3,240 commits); lead a 6-developer team"
period: "2025 – 2026, Brain Station 23"
stack: [".NET 8", "Next.js 15", "React 19", "PostgreSQL", "EF Core", "CQRS/MediatR", "Stripe", "SignalR", "AWS ECS Fargate"]
metrics:
  - { label: "REST endpoints", value: "413" }
  - { label: "Command/query handlers", value: "342" }
  - { label: "Feature modules", value: "54" }
featured: true
order: 2
---

## Context

TPSaaS helps companies manage vendor security risk: supplier onboarding, security assessments, evidence review, risk registers, audits, remediation, and certification. Every customer is a tenant with its own users, data, and subscription plan — so isolation failures are existential, not cosmetic.

<Callout title="My role">
  I architect the platform and am its top contributor (~45% of 3,240 commits across backend and frontend), while leading a 6-developer team and partnering with 2 business analysts on requirements, estimation, and releases.
</Callout>

## Architecture

<ArchDiagram
  layers={[
    { label: "Frontend", items: ["Next.js 15 / React 19", "Role-aware dashboards", "SignalR notifications"] },
    { label: "API", items: ["ASP.NET Core (.NET 8)", "413 REST endpoints", "CQRS — 342 handlers", "54 feature modules"] },
    { label: "Cross-cutting", items: ["Multi-IdP OIDC SSO", "Multi-layer RBAC", "Tenant middleware", "Audit logging"] },
    { label: "Data & Infra", items: ["PostgreSQL + EF Core", "ElastiCache Redis", "Hangfire jobs", "AWS ECS Fargate"] },
  ]}
/>

## Key decisions

**Tenancy enforced in the data layer.** Tenant scoping lives in EF Core global query filters plus middleware that resolves the tenant before any handler runs. Developers cannot forget a `WHERE TenantId = …` — the filter applies unless explicitly and visibly disabled, which code review treats as a red flag.

**CQRS kept honest at scale.** 342 handlers across 54 modules stay navigable because each module owns its commands, queries, and validation — no shared god-services. New features follow a template, which is what makes a 6-developer team productive in parallel without merge wars.

**Identity is pluggable.** Enterprise customers bring their own IdP: the platform speaks OIDC to Azure AD, Okta, Auth0, and others, layered under a role model that separates platform administrators from tenant roles.

**Billing with webhooks, not polling.** Stripe subscriptions (including enterprise plans and quotas) sync through idempotent webhook processing; BitSight security ratings integrate with encrypted tokens and full API audit logging.

## Results

The platform runs on AWS ECS Fargate with RDS PostgreSQL, S3, Secrets Manager, and ElastiCache across development, UAT, and production environments; 13 Hangfire recurring jobs handle assessment reminders, syncs, and digests. In-app SignalR notifications pair with SES email delivery including bounce tracking.

## What I'd do differently

Introduce integration-test coverage per module earlier. The CQRS template made features fast to add; test scaffolding lagged behind it, and backfilling coverage is slower than growing it alongside.
```

- [ ] **Step 2: Create `content/projects/freightoscope-platform.mdx`**

```mdx
---
title: "4.5 Years Evolving a Freight-Forwarding ERP"
summary: "From feature developer to top individual contributor on a 12-project .NET solution — 25+ logistics and accounting integrations, the full rate-to-shipment lifecycle, and a live migration to .NET 10."
role: "Top individual contributor (3,600+ commits); full-time 3 years, now part-time consulting"
period: "2022 – present, Freightoscope (US, remote)"
stack: [".NET 10", "Angular 13 → 20", "SQL Server", "Redis", "SignalR", "Azure DevOps", "Azure Functions", "SSE"]
metrics:
  - { label: "Commits over 4.5 years", value: "3,600+" }
  - { label: "REST endpoints", value: "1,000+" }
  - { label: "Partner integrations", value: "25+" }
featured: true
order: 3
---

## Context

Freightoscope is a cloud ERP for freight forwarders: search rates, quote customers, book cargo, track shipments, invoice, and file customs — across air and sea, in many currencies. I joined in January 2022 and never fully left: three years full-time, and part-time consulting since, with 3,600+ commits as the platform's top individual contributor.

<Callout title="Longevity as evidence">
  Anyone can inherit a codebase; staying accountable to one for 4.5 years — through framework upgrades, integration churn, and production incidents — is the strongest proof of ownership I have.
</Callout>

## Architecture

<ArchDiagram
  layers={[
    { label: "Clients", items: ["Angular 13 main app (526 components)", "Angular 20 customer portal"] },
    { label: "API", items: ["ASP.NET Core — 159 controllers", "1,000+ REST endpoints", "SignalR realtime", "SSE streaming"] },
    { label: "Integrations", items: ["Air/sea rates & booking partners", "FX rates", "4 accounting systems", "EDI mappings"] },
    { label: "Data & Ops", items: ["SQL Server (views, procs)", "Redis cache", "Azure Functions", "5 Azure DevOps pipelines"] },
  ]}
/>

## Key decisions

**Integrations as a product surface.** 25+ partners — air and sea rate providers, booking channels, currency feeds, and accounting systems (QuickBooks, Xero, Zoho, Netvisor) — each with different auth, formats, and failure modes. Resilient wrappers with retries and clear operator-facing errors turned integration breakage from a support fire into a dashboard item.

**The rate lifecycle end to end.** Bulk Excel rate ingestion feeds search; search feeds markup and quotation; quotations become bookings and shipments with e-AWB workflows and AES/ISF/AMS customs filings. Owning one vertical slice completely is why the numbers above are attributable to me rather than to a crowd.

**Performance where users feel it.** Quotation searches stream thousands of live results over Server-Sent Events; Redis caches ports, carriers, units, and FX; hot SQL paths moved into tuned views and stored procedures with bulk inserts replacing row-by-row writes.

**Upgrades as continuous work.** The 12-project solution migrated to .NET 10 while shipping features, and a new customer portal launched on Angular 20 beside the Angular 13 main app — modernization without a rewrite freeze.

## Results

The platform serves forwarders, customers, agents, and shippers with role-based flows, white-label email, PDF rate reports, 300+ report templates, and 6 role-based dashboards. Releases ship through 5 Azure DevOps CI/CD pipelines. I also mentored 2 junior developers to independent delivery.

## What I'd do differently

Push harder, earlier, for automated integration-contract tests around partner APIs. Most production incidents traced to silent partner-side changes that a nightly contract suite would have caught first.
```

- [ ] **Step 3: Create `content/projects/bizxtract-licensing.mdx`**

```mdx
---
title: "A Desktop Product with Fail-Closed Licensing"
summary: "BizXtract — a sole-authored cross-platform desktop app and its licensing platform: Ed25519-signed device-bound entitlements, offline grace, idempotent billing webhooks, and crash-safe local storage."
role: "Sole engineer: desktop client, license server, payments, CI/CD, release pipeline"
period: "2026, independent product"
stack: [".NET 10", "Avalonia", "Node.js", "MongoDB", "Stripe", "Paddle", "Ed25519", "SQLite", "Velopack"]
metrics:
  - { label: "Entitlement TTL", value: "12-hour signed packages" }
  - { label: "Offline grace", value: "3 days, fail-closed after" }
  - { label: "Platforms", value: "Windows + macOS" }
featured: true
order: 4
---

## Context

BizXtract is a lead-generation desktop product I author and ship solo — a .NET 10 + Avalonia rewrite of an older WinForms tool, sold under subscription. Selling software to strangers changes your engineering priorities: licensing, updates, and crash recovery stop being infrastructure and become the product.

<Callout title="Why this project matters">
  It demonstrates the unglamorous engineering that keeps a paid product trustworthy: cryptographic entitlements, billing edge cases, and update rollbacks — all designed and operated by one person.
</Callout>

## Architecture

<ArchDiagram
  layers={[
    { label: "Desktop", items: ["Avalonia UI (Win/macOS)", "SQLite (WAL) local store", "Velopack auto-update"] },
    { label: "Licensing", items: ["Device-bound entitlements", "Ed25519 signatures", "12-hour TTL", "Fail-closed verification"] },
    { label: "Server", items: ["Node.js license server", "MongoDB", "Stripe → Paddle billing", "Idempotent webhooks"] },
  ]}
/>

## Key decisions

**Fail closed, but humanely.** The client verifies an Ed25519-signed entitlement before running and refuses anything unsigned or expired. Entitlements bind to an installation-scoped device ID and re-verify server-side on every call. Because customers work offline, a 3-day grace window keeps them productive past the last sync — with revoked and expired kept as distinct states so support can tell an ex-customer from an airplane passenger.

**Billing webhooks are exactly-once by design.** The Stripe-to-Paddle migration forced idempotent webhook processing: every event handler is safe to replay, so a duplicated or out-of-order delivery cannot double-activate or wrongly revoke a license.

**Updates must be reversible.** Velopack ships delta updates from a CDN with one-line rollback. Combined with SQLite in WAL mode and crash-recovery tests in CI, a bad release or a mid-write power loss degrades to an inconvenience instead of data loss.

## Results

A single codebase ships to Windows and macOS with signed releases, auto-updates, subscription validation, and smoke tests in CI. The licensing platform has survived a live payment-provider migration without locking out a single paying user.

## What I'd do differently

Design the entitlement schema for multiple products from the start. The server assumes one product in several places, and generalizing it now costs more than it would have on day one.
```

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: all PASS; projects test now sees 4 files with orders 1–4.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: remaining three case studies

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Home page — hero, featured cards, evidence panel

**Files:**
- Create: `public/headshot.jpg` (copied), `components/hero.tsx`, `components/project-card.tsx`, `components/evidence-panel.tsx`, `components/section.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `site`, `SITE_URL` from `content/site.ts`; `getAllProjects()` from `lib/projects.ts`.
- Produces: `<Section id title>` wrapper used by all home sections; `<ProjectCard project={ProjectMeta}/>` reused by `/projects`.

- [ ] **Step 1: Copy the headshot**

```bash
cp "/c/projects/Cv Update/builder/headshot.jpg" /c/projects/portfolio/public/headshot.jpg
```

- [ ] **Step 2: Create `components/section.tsx`**

```tsx
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
```

- [ ] **Step 3: Create `components/hero.tsx`**

```tsx
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
```

- [ ] **Step 4: Create `components/project-card.tsx`**

```tsx
import Link from "next/link";
import type { ProjectMeta } from "@/lib/projects";

export function ProjectCard({ project }: { project: ProjectMeta }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col rounded-xl border border-border bg-bg p-5 transition hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <h3 className="text-lg font-bold text-fg group-hover:text-brand">{project.title}</h3>
      <p className="mt-2 flex-1 text-sm text-fg-muted">{project.summary}</p>
      <p className="mt-3 text-sm font-semibold text-brand">
        {project.metrics[0].label}: {project.metrics[0].value}
      </p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {project.stack.slice(0, 5).map((s) => (
          <li key={s} className="rounded-full bg-bg-subtle px-2.5 py-0.5 text-[11px] font-semibold text-fg-muted">
            {s}
          </li>
        ))}
      </ul>
    </Link>
  );
}
```

- [ ] **Step 5: Create `components/evidence-panel.tsx`**

```tsx
import { site } from "@/content/site";

export function EvidencePanel() {
  return (
    <div className="rounded-xl bg-panel p-6 font-mono text-sm text-panel-fg">
      <p className="mb-4 text-xs uppercase tracking-widest text-panel-accent">Verified numbers, not adjectives</p>
      <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
        {site.evidence.map((e) => (
          <div key={e.label} className="flex flex-col gap-0.5">
            <dt className="text-xs text-panel-fg/70">{e.label}</dt>
            <dd className="font-bold text-panel-accent">{e.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
```

- [ ] **Step 6: Replace `app/page.tsx`** (evidence panel below featured, per layout decision)

```tsx
import { Hero } from "@/components/hero";
import { ProjectCard } from "@/components/project-card";
import { EvidencePanel } from "@/components/evidence-panel";
import { Section } from "@/components/section";
import { getAllProjects } from "@/lib/projects";

export const dynamic = "error";

export default function Home() {
  const featured = getAllProjects().filter((p) => p.featured);
  return (
    <>
      <Hero />
      <Section id="projects" title="Case studies">
        <div className="grid gap-4 sm:grid-cols-2">
          {featured.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </Section>
      <Section id="evidence" title="Evidence">
        <EvidencePanel />
      </Section>
    </>
  );
}
```

- [ ] **Step 7: Verify**

Run: `npm run build` → all static, no errors.
Run: `npm run dev` → check hero (photo, CTAs), 4 cards, evidence panel in both themes; CV link 404s for now (arrives in Task 9) — acceptable at this step.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: home hero, featured case-study cards, evidence panel

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 7: Home page — experience, skills, beyond, contact

**Files:**
- Create: `components/experience-timeline.tsx`, `components/skills-grid.tsx`, `components/beyond.tsx`, `components/contact.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `site` fields `experience`, `skills`, `beyond`, `education`, `languages`, `contact`; `<Section>` from Task 6.

- [ ] **Step 1: Create `components/experience-timeline.tsx`**

```tsx
import { site } from "@/content/site";

export function ExperienceTimeline() {
  return (
    <ol className="relative space-y-8 border-l border-border pl-6">
      {site.experience.map((job) => (
        <li key={`${job.company}-${job.dates}`} className="relative">
          <span className="absolute -left-[1.85rem] top-1.5 h-3 w-3 rounded-full border-2 border-bg bg-brand" aria-hidden />
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h3 className="font-bold text-fg">
              {job.title} <span className="font-semibold text-brand">· {job.company}</span>
            </h3>
            <p className="text-sm text-fg-muted">{job.dates}</p>
          </div>
          {job.note && <p className="mt-0.5 text-xs italic text-fg-muted">{job.note}</p>}
          <ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm text-fg-muted">
            {job.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
```

- [ ] **Step 2: Create `components/skills-grid.tsx`**

```tsx
import { site } from "@/content/site";

export function SkillsGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {site.skills.map((group) => (
        <div key={group.category} className="rounded-xl border border-border p-4">
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-brand">{group.category}</h3>
          <ul className="flex flex-wrap gap-1.5">
            {group.items.map((item) => (
              <li key={item} className="rounded-full bg-bg-subtle px-2.5 py-1 text-xs font-medium text-fg">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create `components/beyond.tsx`**

```tsx
import { site } from "@/content/site";

export function Beyond() {
  return (
    <div className="space-y-4">
      <ul className="list-disc space-y-2 pl-5 text-fg-muted">
        {site.beyond.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="text-sm text-fg-muted">
        <span className="font-semibold text-fg">{site.education.degree}</span> — {site.education.school} ·{" "}
        {site.education.detail}
      </p>
      <p className="text-sm text-fg-muted">{site.languages}</p>
    </div>
  );
}
```

- [ ] **Step 4: Create `components/contact.tsx`**

```tsx
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
```

- [ ] **Step 5: Extend `app/page.tsx`** — append the four sections inside the fragment, after the Evidence section:

```tsx
      <Section id="experience" title="Experience">
        <ExperienceTimeline />
      </Section>
      <Section id="skills" title="Skills">
        <SkillsGrid />
      </Section>
      <Section id="beyond" title="Beyond the day job">
        <Beyond />
      </Section>
      <Section id="contact" title="Contact">
        <Contact />
      </Section>
```

with imports added at the top:

```tsx
import { ExperienceTimeline } from "@/components/experience-timeline";
import { SkillsGrid } from "@/components/skills-grid";
import { Beyond } from "@/components/beyond";
import { Contact } from "@/components/contact";
```

- [ ] **Step 6: Verify**

Run: `npm run build` → static, clean.
Browser: timeline shows 6 roles with the Freightoscope part-time note; nav anchor links `/#experience` and `/#contact` scroll correctly; both themes readable.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: experience timeline, skills grid, beyond, contact sections

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 8: Projects index + case-study pages

**Files:**
- Create: `app/projects/page.tsx`, `app/projects/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getAllProjects`, `getProjectBySlug`, `mdxComponents`, `ProjectCard`, `StackChips`, `MetricCard`.
- Produces: routes `/projects` and `/projects/<4 slugs>`, all static (`dynamicParams = false`).

- [ ] **Step 1: Create `app/projects/page.tsx`**

```tsx
import type { Metadata } from "next";
import { ProjectCard } from "@/components/project-card";
import { getAllProjects } from "@/lib/projects";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Projects",
  description: "Case studies: production RAG, multi-tenant SaaS, a freight ERP evolved over 4.5 years, and a licensed desktop product.",
};

const moreWork = [
  { title: "IBM z/OS mainframe port", note: "COBOL/CICS/DB2 airline system ported to IBM Cloud Wazi; demonstrated at a conference in Japan." },
  { title: "z/OS BPXBATCH consulting", note: "Root-caused a failing JCL cloud integration to EBCDIC encoding; delivered production JCL and a runbook." },
  { title: "AI-powered Google Ads platform", note: "Campaign management with ChatGPT-assisted suggestions, Angular Material UI, i18n, white-label." },
  { title: "Democratik campaign CRM", note: "Angular/Node.js platform: form builders, Leaflet maps, Pusher chat, Chrome extension, Gmail add-on." },
  { title: "FarmNet (internship)", note: "Agro-fintech platform connecting farmers, consumers, and investors — ASP.NET Core MVC." },
];

export default function ProjectsPage() {
  const projects = getAllProjects();
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-extrabold text-fg">Projects</h1>
      <p className="mt-2 max-w-2xl text-fg-muted">
        Four deep dives with architecture and measured results, plus smaller work worth a mention.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
      <h2 className="mt-14 mb-4 text-xl font-extrabold text-fg">More work</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {moreWork.map((w) => (
          <li key={w.title} className="rounded-xl border border-border p-4">
            <h3 className="font-bold text-fg">{w.title}</h3>
            <p className="mt-1 text-sm text-fg-muted">{w.note}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 2: Create `app/projects/[slug]/page.tsx`**

```tsx
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
  return { title: project.meta.title, description: project.meta.summary };
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
```

- [ ] **Step 3: Add MDX prose styling to `app/globals.css`** (append at the end)

```css
.prose-portfolio {
  line-height: 1.75;
}
.prose-portfolio h2 {
  margin: 2rem 0 0.75rem;
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--fg);
}
.prose-portfolio p {
  margin: 0.75rem 0;
  color: var(--fg-muted);
}
.prose-portfolio strong {
  color: var(--fg);
}
.prose-portfolio ul {
  margin: 0.75rem 0;
  padding-left: 1.25rem;
  list-style: disc;
  color: var(--fg-muted);
}
```

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: `/projects` static; `/projects/[slug]` shows 4 prerendered paths (● SSG), no dynamic routes.
Browser: index shows 4 cards + 5 "More work" items; each case study renders headings, callouts, diagrams, metric cards in both themes.

- [ ] **Step 5: Run tests** (`npm test`) — all PASS (anonymization now also scans the new files).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: projects index and case-study pages

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 9: SEO (sitemap, robots, JSON-LD, OG images) + web CV PDF

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`, `components/json-ld.tsx`, `scripts/generate-og.mjs`, `public/og/*.png` (6 generated), `public/cv/Jahangir_Alam_Nabin_CV.pdf`
- Modify: `app/layout.tsx` (metadataBase, OG defaults, JSON-LD), `app/projects/[slug]/page.tsx` (per-page OG image), `C:\projects\Cv Update\builder\resume.js` (web variant — outside this repo)

**Interfaces:**
- Consumes: `SITE_URL`, `site`, `getAllProjects`.
- Produces: `/sitemap.xml`, `/robots.txt`, OG PNGs at `/og/home.png`, `/og/projects.png`, `/og/<slug>.png`; CV at `/cv/Jahangir_Alam_Nabin_CV.pdf`.

- [ ] **Step 1: Create `app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";
import { getAllProjects } from "@/lib/projects";

export const dynamic = "error";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, priority: 1 },
    { url: `${SITE_URL}/projects`, priority: 0.8 },
    ...getAllProjects().map((p) => ({ url: `${SITE_URL}/projects/${p.slug}`, priority: 0.7 })),
  ];
}
```

- [ ] **Step 2: Create `app/robots.ts`**

```ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";

export const dynamic = "error";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${SITE_URL}/sitemap.xml` };
}
```

- [ ] **Step 3: Create `components/json-ld.tsx`**

```tsx
import { SITE_URL, site } from "@/content/site";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: "Senior Software Engineer",
    url: SITE_URL,
    email: `mailto:${site.contact.email}`,
    sameAs: [site.contact.linkedin, site.contact.github, site.contact.upwork],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
```

- [ ] **Step 4: Wire metadata in `app/layout.tsx`** — extend the exported `metadata` object and render `<JsonLd />` just inside `<body>`:

```tsx
import { JsonLd } from "@/components/json-ld";
import { SITE_URL } from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Jahangir Nabin — Senior Software Engineer",
    template: "%s — Jahangir Nabin",
  },
  description:
    ".NET, distributed systems, and applied AI. Senior software engineer leading teams and shipping production RAG systems.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Jahangir Nabin — Senior Software Engineer",
    description: ".NET, distributed systems, and applied AI.",
    images: ["/og/home.png"],
  },
};
```

(body starts `<ThemeProvider>` as before; add `<JsonLd />` as the first child inside `<body>`.)

In `app/projects/[slug]/page.tsx`'s `generateMetadata`, extend the return to:

```tsx
  return {
    title: project.meta.title,
    description: project.meta.summary,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: { title: project.meta.title, description: project.meta.summary, images: [`/og/${slug}.png`] },
  };
```

And in `app/projects/page.tsx` metadata add: `openGraph: { images: ["/og/projects.png"] }` and `alternates: { canonical: "/projects" }`.

- [ ] **Step 5: OG generation script — install deps and create `scripts/generate-og.mjs`**

```bash
npm install -D satori@^0.12 @resvg/resvg-js@^2
mkdir -p public/og
```

```js
// Generates static OG images (1200x630) into public/og/. Run: node scripts/generate-og.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const pages = [
  { file: "home", title: "Jahangir Nabin", subtitle: "Senior Software Engineer — .NET, Distributed Systems & Applied AI" },
  { file: "projects", title: "Projects & Case Studies", subtitle: "Production RAG · Multi-tenant SaaS · Freight ERP · Licensed desktop product" },
  { file: "automotive-rag-chatbot", title: "RAG Chatbot Case Study", subtitle: "Hybrid retrieval · recall@100 96.9% → 100% · SLO release gates" },
  { file: "tpsaas-compliance-platform", title: "Multi-Tenant SaaS Case Study", subtitle: "413 endpoints · CQRS · EF Core tenant isolation · Stripe" },
  { file: "freightoscope-platform", title: "Freight ERP Case Study", subtitle: "4.5 years · 25+ integrations · 3,600+ commits" },
  { file: "bizxtract-licensing", title: "Fail-Closed Licensing Case Study", subtitle: "Ed25519 entitlements · offline grace · idempotent webhooks" },
];

const font = await fetch("https://unpkg.com/@fontsource/inter@5.0.16/files/inter-latin-700-normal.woff").then((r) => {
  if (!r.ok) throw new Error(`font download failed: ${r.status}`);
  return r.arrayBuffer();
});

mkdirSync("public/og", { recursive: true });

for (const page of pages) {
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0f2740",
          color: "#ffffff",
          fontFamily: "Inter",
        },
        children: [
          { type: "div", props: { style: { fontSize: 64, fontWeight: 700 }, children: page.title } },
          { type: "div", props: { style: { fontSize: 30, marginTop: 24, color: "#7fb1e0" }, children: page.subtitle } },
          { type: "div", props: { style: { fontSize: 24, marginTop: 48, color: "#7ee0a3" }, children: "portfolio-jnabin.vercel.app" } },
        ],
      },
    },
    { width: 1200, height: 630, fonts: [{ name: "Inter", data: font, weight: 700, style: "normal" }] }
  );
  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
  writeFileSync(`public/og/${page.file}.png`, png);
  console.log(`wrote public/og/${page.file}.png (${png.length} bytes)`);
}
```

Run: `node scripts/generate-og.mjs` → expected: 6 PNGs written. (If the font fetch fails behind a proxy, retry; the script hard-fails rather than writing broken images.)

- [ ] **Step 6: Web CV variant (phone-free) — modify the CV builder** (in `C:\projects\Cv Update`, not this repo)

In `C:\projects\Cv Update\builder\resume.js`:

(a) In `buildDoc`, change the signature to `function buildDoc({ photo, includePhone = true })` and replace the contact-line paragraph children with:

```js
      run(C.location + (includePhone ? "  |  " + C.phone : "") + "  |  "),
      new ExternalHyperlink({ link: "mailto:" + C.email, children: [new TextRun({ text: C.email, color: NAVY })] }),
```

(b) In the `variants` array in main, add:

```js
    { photo: false, includePhone: false, file: "Jahangir_Alam_Nabin_CV_Web.docx" },
```

and pass the flag through: `buildDoc({ photo: v.photo, includePhone: v.includePhone })`.

Then build and convert (PowerShell, from `C:\projects\Cv Update\builder`):

```powershell
node resume.js
python -c "import win32com.client, os; w=win32com.client.DispatchEx('Word.Application'); w.Visible=False; d=w.Documents.Open(r'C:\projects\Cv Update\Jahangir_Alam_Nabin_CV_Web.docx', ReadOnly=True); d.ExportAsFixedFormat(OutputFileName=r'C:\projects\Cv Update\Jahangir_Alam_Nabin_CV_Web.pdf', ExportFormat=17); d.Close(0); w.Quit()"
```

Copy into the site:

```bash
mkdir -p /c/projects/portfolio/public/cv
cp "/c/projects/Cv Update/Jahangir_Alam_Nabin_CV_Web.pdf" "/c/projects/portfolio/public/cv/Jahangir_Alam_Nabin_CV.pdf"
```

Verify the PDF contains no phone number: open it or extract text (`python -c "import fitz; print('+880' in ''.join(p.get_text() for p in fitz.open(r'C:\projects\portfolio\public\cv\Jahangir_Alam_Nabin_CV.pdf')))"` → expected `False`).

- [ ] **Step 7: Verify build + tests**

Run: `npm run build` → static, `/sitemap.xml` and `/robots.txt` in route list.
Run: `npm test` → all PASS (PNG/PDF are excluded from the anonymization text scan by extension).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: SEO metadata, sitemap, robots, JSON-LD, OG images, web CV

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 10: Final verification pass + README + deploy handoff

**Files:**
- Create: `README.md`
- Modify: anything the verification pass flags.

**Interfaces:**
- Consumes: everything. Produces: a repo ready for `git push` + Vercel import.

- [ ] **Step 1: Full gate**

```bash
npm run lint && npx tsc --noEmit && npm test && npm run build
```

Expected: all clean; build lists `/`, `/projects`, 4 slug pages, sitemap, robots — every route static.

- [ ] **Step 2: Browser pass (production build)**

```bash
npm run build && npx next start -p 3100
```

Check on `http://localhost:3100`, in BOTH themes, at 375px and 1280px widths:
- every route renders; no horizontal scroll on mobile;
- nav suffix behavior; mobile menu; theme toggle persists across reloads;
- CV downloads (no phone inside); all 4 contact links correct;
- case-study diagrams and metric cards readable in dark mode.

- [ ] **Step 3: Lighthouse**

Run Lighthouse (browser devtools or `npx lighthouse http://localhost:3100 --quiet --chrome-flags="--headless"`) on `/` and one case study.
Expected: Performance, SEO, Accessibility, Best Practices all ≥ 95. Fix anything below (images, contrast, missing alt/aria) and re-run.

- [ ] **Step 4: Create `README.md`**

```markdown
# Portfolio — Jahangir Alam Nabin

Static portfolio site: Next.js (App Router) + Tailwind CSS, fully prerendered.

## Develop

npm install
npm run dev

## Verify

npm run lint && npx tsc --noEmit && npm test && npm run build

## Content

- `content/site.ts` — all profile copy (hero, experience, skills, contact)
- `content/projects/*.mdx` — case studies (frontmatter + prose)
- `public/cv/` — downloadable CV (web variant, no phone number)
- `public/og/` — pre-generated OpenGraph images (`node scripts/generate-og.mjs`)

## Deploy

Push to GitHub and import the repo at vercel.com/new — zero configuration.
After the first deploy, set the final URL in `content/site.ts` (`SITE_URL`) and redeploy.
```

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "docs: README and final verification fixes

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

- [ ] **Step 6: Handoff to the user (manual steps only they can do)**

1. Create the GitHub repo: `gh repo create jnabin/portfolio --public --source . --push` (or create empty repo on github.com under the **jnabin** account and `git remote add origin git@github-main-personal:jnabin/portfolio.git && git push -u origin main` — note the SSH alias for the personal account from `~/.ssh/config`).
2. Import at vercel.com/new with the jnabin GitHub account; framework auto-detects; deploy.
3. Report the assigned `*.vercel.app` URL back so `SITE_URL` gets updated (one-line change + redeploy) — OG/canonical/sitemap URLs depend on it.

---

## Self-review (performed while writing)

- **Spec coverage:** IA/routes → Tasks 6–8; nav brand rule → Task 2; tokens/dark/AA → Task 2; content model → Tasks 3–5; MDX components incl. ArchDiagram → Task 4; evidence panel below featured → Task 6; timeline/skills/beyond/contact → Task 7; more-work strip → Task 8; SEO (sitemap/robots/JSON-LD/static OG PNGs) → Task 9; phone-free CV → Task 9; anonymization gate incl. commit messages → Task 3 (runs every `npm test`); verification gates → Task 10; deploy → Task 10 handoff. No gaps found.
- **Placeholder scan:** all code blocks complete; no TBDs. The only user-dependent value is the final Vercel URL, explicitly handled as a post-deploy one-line change.
- **Type consistency:** `ProjectMeta` fields match across loader (Task 4), cards (Task 6), pages (Task 8), sitemap/OG (Task 9). `site` fields consumed in Tasks 6–7 all exist in Task 3's `content/site.ts`. Token utility names (`bg-bg`, `text-fg-muted`, `bg-panel`, `text-panel-accent`) match Task 2's `@theme` block.
