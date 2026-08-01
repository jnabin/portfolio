export const SITE_URL = "https://portfolio-jnabin.vercel.app";

type ExperienceItem = {
  title: string;
  company: string;
  dates: string;
  note?: string;
  lines: string[];
};

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
  ] as ExperienceItem[],
  skills: [
    { category: "Languages", items: ["C#", "Python", "TypeScript", "JavaScript", "SQL"] },
    { category: "Backend & Frontend", items: [".NET 8/9/10", "ASP.NET Core", "FastAPI", "Node.js", "Angular", "React/Next.js", "SignalR", "Socket.IO", "REST APIs", "RxJS", "NgRx"] },
    { category: "AI & LLM Engineering", items: ["RAG", "LLM integration", "Generative AI", "Prompt engineering", "LangChain", "Semantic Kernel", "Cohere reranking", "Qdrant", "pgvector", "Hybrid search (BM25, RRF)"] },
    { category: "Architecture & Messaging", items: ["Clean Architecture", "CQRS (MediatR)", "Modular monoliths", "Microservices", "Domain-Driven Design", "Kafka", "MassTransit", "Transactional outbox", "SOLID"] },
    { category: "Data & Cloud", items: ["PostgreSQL", "SQL Server", "MongoDB", "Redis", "EF Core", "Dapper", "AWS (EC2, S3, ECS Fargate, RDS)", "Azure (Functions, Blob, DevOps)", "Docker", "GitHub Actions", "IBM Cloud"] },
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
