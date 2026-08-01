# Portfolio — Jahangir Alam Nabin

Static portfolio site: Next.js (App Router) + Tailwind CSS, fully prerendered.

## Develop

```bash
npm install
npm run dev
```

## Verify

```bash
npm run lint && npx tsc --noEmit && npm test && npm run build
```

## Content

- `content/site.ts` — all profile copy (hero, experience, skills, contact)
- `content/projects/*.mdx` — case studies (frontmatter + prose)
- `public/cv/` — downloadable CV (web variant, no phone number)
- `public/og/` — pre-generated OpenGraph images (`node scripts/generate-og.mjs`)

## Deploy

Push to GitHub and import the repo at vercel.com/new — zero configuration.
After the first deploy, set the final URL in `content/site.ts` (`SITE_URL`) and redeploy. If the assigned URL differs, update `SITE_URL`, run `node scripts/generate-og.mjs`, and commit the regenerated images.
