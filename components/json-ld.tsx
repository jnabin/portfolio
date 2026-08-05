import { SITE_URL, site } from "@/content/site";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: site.name,
        jobTitle: "Senior Software Engineer",
        url: SITE_URL,
        email: `mailto:${site.contact.email}`,
        sameAs: [site.contact.linkedin, site.contact.upwork],
      },
      {
        "@type": "VideoObject",
        name: `${site.name} — ${site.introVideo.title}`,
        description: "A 60-second video introduction by Jahangir Alam Nabin, Senior Software Engineer.",
        thumbnailUrl: `${SITE_URL}${site.introVideo.posterSrc}`,
        uploadDate: "2026-08-05",
        embedUrl: `https://www.youtube-nocookie.com/embed/${site.introVideo.youtubeId}`,
        contentUrl: `https://youtube.com/shorts/${site.introVideo.youtubeId}`,
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
