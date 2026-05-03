"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { Icons } from "@/components/common/icons";

interface ScreenshotGalleryProps {
  screenshots: string[];
  altPrefix?: string;
  /** "strip" = horizontal scroll thumbnails (featured card), "grid" = wrapping gallery (detail page) */
  variant?: "strip" | "grid";
}

export default function ScreenshotGallery({
  screenshots,
  altPrefix = "Project screenshot",
  variant = "strip",
}: ScreenshotGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const isOpen = lightboxIndex !== null;

  const close = useCallback(() => setLightboxIndex(null), []);

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? Math.max(0, i - 1) : null));
  }, []);

  const next = useCallback(() => {
    setLightboxIndex((i) =>
      i !== null ? Math.min(screenshots.length - 1, i + 1) : null
    );
  }, [screenshots.length]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close, prev, next]);

  if (!screenshots.length) return null;

  // Smart grid: 2 cols for ≤2 or exactly 4 images (avoids orphans), 3 cols otherwise
  const count = screenshots.length;
  const useThreeCols = variant === "grid" && count > 2 && count !== 4;

  return (
    <>
      {/* Thumbnails */}
      <div
        className={
          variant === "grid"
            ? useThreeCols
              ? "grid grid-cols-2 sm:grid-cols-3 gap-3"
              : "grid grid-cols-2 gap-3"
            : "flex gap-2 overflow-x-auto pb-1 scrollbar-thin"
        }
      >
        {screenshots.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setLightboxIndex(i)}
            className={
              variant === "grid"
                ? "group relative aspect-video rounded-lg overflow-hidden border border-border cursor-zoom-in"
                : "group flex-shrink-0 relative w-36 h-24 sm:w-48 sm:h-32 rounded-lg overflow-hidden border border-border cursor-zoom-in"
            }
            aria-label={`View ${altPrefix} ${i + 1}`}
          >
            <Image
              src={src}
              alt={`${altPrefix} ${i + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
              className="object-cover transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {isOpen && lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${altPrefix} ${lightboxIndex + 1} of ${screenshots.length}`}
          onClick={close}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-150"
        >
          {/* Main image */}
          <img
            src={screenshots[lightboxIndex]}
            alt={`${altPrefix} ${lightboxIndex + 1}`}
            className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-2xl object-contain cursor-default"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Close */}
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-full bg-background/80 border border-border text-foreground hover:bg-background transition-colors"
            aria-label="Close screenshot viewer"
          >
            <Icons.close className="w-4 h-4" />
          </button>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70 font-medium">
            {lightboxIndex + 1} / {screenshots.length}
          </div>

          {/* Prev / Next */}
          {lightboxIndex > 0 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-background/80 border border-border text-foreground hover:bg-background transition-colors"
              aria-label="Previous screenshot"
            >
              <Icons.chevronLeft className="w-5 h-5" />
            </button>
          )}
          {lightboxIndex < screenshots.length - 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-background/80 border border-border text-foreground hover:bg-background transition-colors"
              aria-label="Next screenshot"
            >
              <Icons.chevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </>
  );
}
