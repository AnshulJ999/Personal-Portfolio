"use client";

import { useCallback, useEffect, useState } from "react";

interface ZoomableImageProps {
  src?: string;
  alt?: string;
}

export function ZoomableImage({ src, alt }: ZoomableImageProps) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    // Lock body scroll while lightbox is open
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  if (!src) return null;

  return (
    <>
      {/*
        Inline image — full width on mobile, capped at 400px tall on sm+.
        cursor-zoom-in signals to the user the image is expandable.
        Slight opacity fade on hover as a hover affordance.
      */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group block mx-auto my-6 w-full cursor-zoom-in"
        aria-label={`Expand image${alt ? `: ${alt}` : ""}`}
      >
        <img
          src={src}
          alt={alt ?? ""}
          className="
            rounded-xl border border-border
            w-full sm:w-auto
            max-h-[260px] sm:max-h-[400px]
            max-w-full
            mx-auto
            object-contain
            transition-opacity duration-150
            group-hover:opacity-75
          "
        />
      </button>

      {/* Lightbox overlay — click outside or press Esc to close */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt ?? "Image expanded view"}
          onClick={close}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm cursor-zoom-out p-4 sm:p-10 animate-in fade-in duration-150"
        >
          {/* Stop clicks on the image itself from closing the overlay */}
          <img
            src={src}
            alt={alt ?? ""}
            className="max-w-full max-h-full rounded-xl shadow-2xl object-contain cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
