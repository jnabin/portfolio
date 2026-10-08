import { site } from "@/content/site";

function Stars() {
  return (
    <span className="flex items-center gap-0.5 text-amber-400" aria-label="Rated 5.0 out of 5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
        </svg>
      ))}
      <span className="ml-1.5 text-sm font-bold text-fg">5.0</span>
    </span>
  );
}

export function Testimonials() {
  const more = site.upworkFiveStarReviews - site.testimonials.length;
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {site.testimonials.map((t) => (
          <figure key={t.quote} className="flex flex-col rounded-xl border border-border bg-bg p-5">
            <Stars />
            <blockquote className="mt-3 flex-1 text-fg">&ldquo;{t.quote}&rdquo;</blockquote>
            <figcaption className="mt-4 text-sm">
              <span className="font-semibold text-fg">{t.context}</span>
              {t.detail && <span className="block text-fg-muted">{t.detail}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="text-sm text-fg-muted">
        Quoted word for word from client reviews.{" "}
        <a href={site.contact.upwork} className="font-semibold text-brand hover:underline" target="_blank" rel="noopener noreferrer">
          {more > 0 ? `+${more} more 5-star reviews on Upwork →` : "Verify on Upwork →"}
        </a>
      </p>
    </div>
  );
}
