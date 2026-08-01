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
