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
