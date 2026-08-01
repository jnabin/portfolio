# Portfolio Website — Design Spec

**Date:** 2026-08-01
**Owner:** Jahangir Alam Nabin (github.com/jnabin)
**Deploy target:** Vercel (static), repo `github.com/jnabin/portfolio` (public — doubles as a code sample)

## Purpose

A modern professional portfolio supporting Jahangir's international remote job search. Audience: recruiters (skim: identity, evidence, CV download) and interviewing engineers (read: case studies with architecture depth). The site presents the same verified claims as his 2026 CV, expanded into deep-dive case studies.

## Decisions (user-confirmed)

1. **Scope:** multi-page with 4 case-study deep dives. No blog.
2. **Public detail:** deep case studies with architecture narratives and CV-level metrics. Employers named (Brain Station 23, Freightoscope, SkyTech Solutions); clients anonymized (see Anonymization).
3. **Visual direction:** "Navy Professional" — light theme with navy `#1F4E79` brand (matches CV/cover letter) **plus a dark mode toggle**.
4. **Homepage layout:** split hero with photo; dark evidence panel placed further down the page.
5. **Contact:** direct links only (email, LinkedIn, GitHub, Upwork). No form, no backend.
6. **Stack:** Next.js (App Router, TypeScript strict) + Tailwind CSS, fully static generation. No API routes, no server actions.

## Information architecture

```
/                    Home
/projects            Projects index (4 featured + "More work" strip)
/projects/[slug]     Case studies (4)
```

### Home page, top to bottom

1. **Nav** — brand "Jahangir Nabin" (wide screens: "Jahangir Nabin · Software Engineer"; mobile: name only, never bare initials), links Projects / Experience / Contact, dark-mode toggle.
2. **Split hero** — left: name; headline "Senior Software Engineer — .NET, Distributed Systems & Applied AI"; 2-sentence intro; CTAs *View projects* and *Download CV*. Right: headshot (circle) + one stat card (100% Upwork Job Success).
3. **Featured case studies** — 4 cards: title, one-liner, stack chips, one key metric each.
4. **Evidence panel** — dark, monospace: recall@100 96.9%→100%; SLO gates (≥70% standard-answer, ≥80% citation coverage, ≤2% error); 1,400+ REST endpoints across platforms; 25+ external integrations; 3,600+ commits on one product over 4.5 years.
5. **Experience timeline** — 6 roles mirroring the CV (title, company, dates, ~2 lines each): Brain Station 23 (Jul 2025–Present), SkyTech/Codezzi (Jan–Jul 2025), Freightoscope (Jan 2022–Present; full-time to Feb 2025, then part-time consulting), Quadiro (part-time, Nov 2021–Jun 2022), Democratik (Dec 2020–Jan 2022), Code Source internship (Sep–Dec 2020).
6. **Skills grid** — the CV's 6 categories as chip groups (Languages / Backend & Frontend / AI & LLM Engineering / Architecture & Messaging / Data & Cloud / Quality & Security).
7. **Beyond the day job** — mainframe/COBOL-on-IBM-Cloud story, freelance record (100% JSS, 20 contracts, 2,390+ hours), education (BSc CSE, AIUB, CGPA 3.91, Magna Cum Laude), languages.
8. **Contact** — buttons: Email (mailto), LinkedIn, GitHub, Upwork.

### Case studies (each: context → architecture + diagram → key decisions & trade-offs → measured results → "what I'd do differently")

| Slug | Title | Core story |
|---|---|---|
| `automotive-rag-chatbot` | RAG Chatbot for a Global Automotive Client | Python/FastAPI Clean Architecture; hybrid retrieval (dense + BM25, RRF fusion, Cohere reranking); 4-layer Redis caching with singleflight; SSE streaming; eval harness — recall@100 96.9%→100%, 100% disambiguation win-rate (27 cases); SLO release gates |
| `tpsaas-compliance-platform` | Multi-Tenant Compliance SaaS | .NET 8 + Next.js/React 19; tenancy via EF Core global query filters; CQRS (413 endpoints, 342 handlers, 54 modules); multi-IdP OIDC SSO; Stripe billing webhooks; BitSight integration; AWS ECS Fargate |
| `freightoscope-platform` | 4.5 Years Evolving a Freight ERP | 12-project solution migrated to .NET 10; 25+ logistics/accounting integrations; full rate lifecycle; Redis/SQL performance work; SSE streaming; Angular 13 + new Angular 20 portal; longevity/ownership story (3,600+ commits, top contributor) |
| `bizxtract-licensing` | Desktop Product with Fail-Closed Licensing | .NET 10 + Avalonia (Windows/macOS); Ed25519-signed device-bound entitlements on 12-hour TTLs; fail-closed verification; 3-day offline grace; Stripe→Paddle migration with idempotent webhooks; Velopack updates; SQLite WAL crash recovery |

**Projects index "More work" strip** (cards, no dedicated pages): IBM z/OS mainframe port (COBOL/CICS/DB2 → IBM Cloud Wazi; conference demo in Japan), z/OS BPXBATCH/JCL consulting, AI-powered Google Ads platform, Democratik campaign CRM, FarmNet (internship).

## Anonymization rules (hard requirements)

- The automotive client is **never named** — not in prose, slugs, file names, alt text, image EXIF, code comments, or **git commit messages**. Always "a global automotive client".
- Internal project codenames from employer repos (e.g., app/product codenames) do not appear anywhere.
- Metrics never exceed what the 2026 CV already discloses.
- Employers are named; client companies are not.

## CV download

`/public` ships a **web variant** of the international CV PDF: identical content minus the phone number (regenerated via the existing `C:\projects\Cv Update\builder\resume.js` pipeline with a flag). Email remains. Rationale: the site is public and indexed; phone-scraping is the only real exposure.

## Technical architecture

- **Next.js App Router + TypeScript (strict) + Tailwind CSS.** All routes statically generated; build fails if any route becomes dynamic. No API routes, no server actions, no runtime env vars.
- **Content model:** `content/site.ts` (typed profile: nav, hero, stats, experience, skills, contact) and `content/projects/*.mdx` (frontmatter: `title, summary, role, period, stack[], metrics[], featured, order`). Custom MDX components: `MetricCard`, `StackChips`, `ArchDiagram`, `Callout`. Diagrams are hand-built lightweight SVG/HTML components — no diagram library in the client bundle.
- **Theming:** design tokens as CSS variables consumed by Tailwind; `next-themes` class strategy; toggle in nav; respects system preference; no flash on load. Navy `#1F4E79` primary on light; lightened navy/sky accents on dark; all pairs pass WCAG AA.
- **Fonts:** `next/font` — Inter (text), JetBrains Mono (evidence panel, code accents).
- **Client JS:** only the theme toggle and mobile menu are client components; everything else is static server output.
- **SEO:** per-page metadata + OpenGraph images (pre-generated static PNGs in `/public/og/`, one per page — no runtime image generation), `sitemap.xml`, `robots.txt`, JSON-LD `Person` on home, canonical URLs, descriptive case-study titles.
- **Accessibility:** semantic landmarks, keyboard-visible focus, alt text, `prefers-reduced-motion` respected, contrast-checked palette.

## Verification

1. `npm run build` passes with all routes static (the gate).
2. ESLint + `tsc --noEmit` clean.
3. Browser pass on the local build: every route, both themes, mobile (375px) and desktop (1280px) widths.
4. Lighthouse: performance/SEO/accessibility ≥ 95 on home and one case study.
5. Link check: nav, contact links (mailto/LinkedIn/GitHub/Upwork), CV download works.
6. Grep gate for anonymization: forbidden client/codename strings absent from the entire repo and git log.

## Deployment

Git repo at `C:\projects\portfolio` → push to `github.com/jnabin/portfolio` (public). User imports the repo in Vercel dashboard (requires their login); zero configuration — framework auto-detected. Lands on a `*.vercel.app` URL; custom domain optional later. `.gitignore` covers `node_modules/`, `.next/`, `.vercel/`, `.superpowers/`, `.env*`.

## Out of scope (YAGNI)

Blog, contact form, CMS, analytics (Vercel dashboard toggle later if wanted), i18n, heavy animation, testimonials carousel, custom domain setup.
