"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";

export function IntroVideo() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) {
      dialog.showModal();
      closeButtonRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label="Play 60-second video introduction"
        className="inline-flex items-center gap-2 rounded-md border border-border bg-bg px-4 py-2 text-sm font-semibold text-fg hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-brand-fg">
          <svg width="8" height="8" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M4.5 2.5v11l9-5.5z" />
          </svg>
        </span>
        {site.introVideo.label}
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onKeyDown={(e) => {
          if (e.key === "Escape") dialogRef.current?.close();
        }}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        aria-label={site.introVideo.title}
        className="m-auto bg-transparent p-0 backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        {open && (
          <div className="relative aspect-[9/16] h-[min(85dvh,42rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-border bg-black">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${site.introVideo.youtubeId}?autoplay=1&rel=0`}
              title={site.introVideo.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
            <button
              type="button"
              ref={closeButtonRef}
              onClick={() => dialogRef.current?.close()}
              aria-label="Close video"
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M2 2l10 10M12 2L2 12" />
              </svg>
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
