import { SITE_URL, site } from "@/content/site";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: "Senior Software Engineer",
    url: SITE_URL,
    email: `mailto:${site.contact.email}`,
    sameAs: [site.contact.linkedin, site.contact.upwork],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
