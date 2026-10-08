import type { Metadata } from "next";
import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { getAllProjects } from "@/lib/projects";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Mainframe & z/OS",
  description:
    "Hands-on IBM z/OS engineering: JCL, CICS, COBOL, DB2, REXX, BPXBATCH/SFTP cloud integration, and IBM Cloud Wazi deployment.",
  alternates: { canonical: "/mainframe" },
  openGraph: { images: ["/og/mainframe.png"] },
};

const capabilities = [
  {
    title: "IBM z/OS & JCL",
    body: "Dataset allocation, compile-bind-deploy JCL, APF-authorization and 80-column pitfalls, SDSF-driven debugging. 20+ jobs written for one deployment alone.",
    evidence: "12 PDS datasets · 20+ JCL jobs",
  },
  {
    title: "CICS & BMS",
    body: "CICS TS 6.2 resource definitions, pseudo-conversational COBOL, BMS mapset assembly, and green-screen flows tested over TN3270.",
    evidence: "6 online programs · 5 BMS mapsets",
  },
  {
    title: "REXX",
    body: "REXX execs that parse control cards with EXECIO and generate per-run SFTP command files, so one job serves many programmers without edits.",
    evidence: "Per-programmer batch job generation",
  },
  {
    title: "SFTP & BPXBATCH",
    body: "z/OS UNIX from batch: BPXBATCH return-code masking, iconv EBCDIC→ASCII conversion, SSH key authentication, Co:Z and IBM OpenSSH variants.",
    evidence: "CC 3840 decoded to sftp exit 255",
  },
  {
    title: "IBM Cloud Wazi",
    body: "Provisioned and ran z/OS 3.1 Dev/Test on IBM Cloud VPC: OpenVPN access, security groups, z/OSMF on a non-standard port.",
    evidence: "Clean instance → working CICS app",
  },
  {
    title: "Zowe tooling",
    body: "Zowe CLI over z/OSMF REST for uploads, job submission and spool retrieval, with codepage-safe transfers that ended a whole class of EBCDIC bugs.",
    evidence: "Scripted, repeatable deployments",
  },
];

const environment = [
  { label: "Operating system", value: "IBM z/OS 3.1 (Wazi Dev/Test)" },
  { label: "Transaction server", value: "CICS TS 6.2" },
  { label: "Database", value: "DB2 v13" },
  { label: "Compiler", value: "Enterprise COBOL 6.5" },
  { label: "System interfaces", value: "z/OSMF REST · TSO/ISPF · SDSF" },
  { label: "File transfer", value: "SFTP (Co:Z & IBM OpenSSH) · Zowe CLI" },
  { label: "Terminal", value: "TN3270 / TN3270S" },
  { label: "Scripting", value: "JCL · REXX · USS shell" },
];

const caseStudySlugs = ["zos-airline-wazi-port", "zos-sftp-cloud-integration"];

export default function MainframePage() {
  const caseStudies = getAllProjects().filter((p) => caseStudySlugs.includes(p.slug));
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-extrabold text-fg">Mainframe &amp; z/OS</h1>
      <p className="mt-2 max-w-2xl text-fg-muted">
        Most of my work is modern .NET and AI platforms, but I also ship on big iron. I ported a
        COBOL/CICS/DB2 system to IBM Cloud Wazi from a bare instance, and I consult on z/OS-to-cloud
        integration: JCL, BPXBATCH, REXX, and SFTP with proper EBCDIC handling.
      </p>

      <h2 className="mt-10 mb-4 text-xl font-extrabold text-fg">What I work with</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((c) => (
          <div key={c.title} className="flex flex-col rounded-xl border border-border bg-bg p-5">
            <h3 className="text-lg font-bold text-fg">{c.title}</h3>
            <p className="mt-2 flex-1 text-sm text-fg-muted">{c.body}</p>
            <p className="mt-3 text-sm font-semibold text-brand">{c.evidence}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-14 mb-4 text-xl font-extrabold text-fg">Environments worked on</h2>
      <div className="rounded-xl bg-panel p-6 font-mono text-sm text-panel-fg">
        <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {environment.map((e) => (
            <div key={e.label} className="flex flex-col gap-0.5">
              <dt className="text-xs text-panel-fg/70">{e.label}</dt>
              <dd className="font-bold text-panel-accent">{e.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <h2 className="mt-14 mb-4 text-xl font-extrabold text-fg">Case studies</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {caseStudies.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>

      <p className="mt-10 text-sm text-fg-muted">
        Looking for the rest of my work?{" "}
        <Link href="/projects" className="font-semibold text-brand hover:underline">
          All projects →
        </Link>
      </p>
    </div>
  );
}
