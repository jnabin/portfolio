// Generates static OG images (1200x630) into public/og/. Run: node scripts/generate-og.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const siteTs = readFileSync("content/site.ts", "utf-8");
const SITE_URL = siteTs.match(/SITE_URL\s*=\s*"([^"]+)"/)[1];
const SITE_HOST = new URL(SITE_URL).host;

const pages = [
  { file: "home", title: "Jahangir Nabin", subtitle: "Senior Software Engineer — .NET, Distributed Systems & Applied AI" },
  { file: "projects", title: "Projects & Case Studies", subtitle: "Production RAG + MCP · Android + Go product · Multi-tenant SaaS · Freight ERP" },
  { file: "automotive-rag-chatbot", title: "RAG Chatbot Case Study", subtitle: "Owner-manual AI · MCP external data · quality-gated releases" },
  { file: "automotive-content-platform", title: "Automotive Platform Case Study", subtitle: "Modular monolith · transactional outbox · Kafka · 4,300+ tests" },
  { file: "automotive-driver-app", title: "Driver App + Mobile BFF", subtitle: "Flutter · .NET BFF · consent & GDPR · AI weather tips · per-user data" },
  { file: "family-nearby", title: "Family Nearby", subtitle: "Android + Go · live WebSocket map · tag-to-prod CI/CD · built solo with Claude Code" },
  { file: "airflow-bigquery-weather-pipeline", title: "Airflow + BigQuery Data Layer", subtitle: "65-way mapped backfill · idempotent MERGE · 1.9 MB → 145 KB per chunk · CI-gated DAGs" },
  { file: "tpsaas-compliance-platform", title: "Multi-Tenant SaaS Case Study", subtitle: "413 endpoints · CQRS · EF Core tenant isolation · Stripe" },
  { file: "freightoscope-platform", title: "Freight ERP Case Study", subtitle: "4.5 years · 25+ integrations · 3,600+ commits" },
  { file: "bizxtract-licensing", title: "Fail-Closed Licensing Case Study", subtitle: "Ed25519 entitlements · offline grace · idempotent webhooks" },
  { file: "democratik-campaign-crm", title: "Campaign CRM Case Study", subtitle: "One product, five surfaces · 821 commits · canvassing, dialing, donations" },
  { file: "mainframe", title: "Mainframe & z/OS", subtitle: "IBM z/OS · JCL · CICS · REXX · SFTP · IBM Cloud Wazi" },
  { file: "zos-airline-wazi-port", title: "z/OS Airline Port Case Study", subtitle: "COBOL/CICS/DB2 on IBM Cloud Wazi · 30+ errors diagnosed · shown in Japan" },
  { file: "zos-sftp-cloud-integration", title: "z/OS SFTP Consulting Case Study", subtitle: "BPXBATCH silent failure · CC 3840 decoded · 4 defects from one review" },
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
          { type: "div", props: { style: { fontSize: 24, marginTop: 48, color: "#7ee0a3" }, children: SITE_HOST } },
        ],
      },
    },
    { width: 1200, height: 630, fonts: [{ name: "Inter", data: font, weight: 700, style: "normal" }] }
  );
  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
  writeFileSync(`public/og/${page.file}.png`, png);
  console.log(`wrote public/og/${page.file}.png (${png.length} bytes)`);
}
