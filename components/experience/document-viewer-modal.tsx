"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2, X } from "lucide-react";

export interface DocumentPage {
  src: string;
  alt: string;
}

interface DocumentViewerModalProps {
  pages: DocumentPage[];
  onClose: () => void;
}

/**
 * Full-screen document viewer modal.
 * - Desktop: both pages side by side, filling the viewport height.
 * - Mobile:  pages stacked vertically, each filling the screen width.
 * - Close: X button (top-right), click outside images, or press ESC.
 * - Right-click and drag disabled for image protection.
 */
export function DocumentViewerModal({
  pages,
  onClose,
}: DocumentViewerModalProps) {
  // Ref pattern: keeps ESC handler stable regardless of how many times
  // the parent re-renders and re-creates the onClose arrow function.
  // Without this, useEffect would tear down and restart on every render,
  // causing a brief body overflow flicker each time.
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; });

  const [zoomed, setZoomed] = useState(false);

  // ESC to close + body scroll lock. Empty deps — runs once, stays stable.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const blockContext = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150 overflow-auto"
      aria-modal="true"
      role="dialog"
      aria-label="Recommendation letter viewer"
    >
      {/* ── Close button — fixed top-right, always reachable on mobile ── */}
      <button
        onClick={onClose}
        className="fixed top-3 right-3 z-[51] w-9 h-9 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>

      {/*
       * Inner flex container.
       * flex-col on mobile (stacked), flex-row on md+ (side by side).
       * min-h-full + items-center centres images vertically when they fit.
       * md:max-w-[47vw] on images caps desktop width so two images + gap
       * never exceed the viewport at the md breakpoint (768px).
       */}
      <div
        className={`flex flex-col md:flex-row items-center gap-4 p-3 md:p-4 min-h-full ${zoomed ? "justify-start" : "justify-center"}`}
        style={{ userSelect: "none" }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        onContextMenu={blockContext}
      >
        {pages.map((page, i) => (
          <div
            key={page.src}
            className="relative rounded-lg overflow-hidden shadow-2xl flex-shrink-0 group"
            onContextMenu={blockContext}
            onClick={(e) => { e.stopPropagation(); setZoomed((z) => !z); }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={page.src}
              alt={page.alt}
              draggable={false}
              onContextMenu={blockContext}
              className="block w-auto h-auto rounded-lg max-w-[96vw] md:max-w-[47vw]"
              style={{
                // When zoomed: inline style overrides Tailwind classes → 1.5× bigger.
                // When normal: inline maxWidth is unset so md:max-w-[47vw] applies correctly.
                ...(zoomed ? { maxWidth: "144vw" } : {}),
                maxHeight: zoomed ? "144vh" : "96vh",
                cursor: zoomed ? "zoom-out" : "zoom-in",
                transition: "max-height 0.25s ease, max-width 0.25s ease",
              }}
            />
            {/* Zoom hint — shows on hover, pointer-events-none so clicks reach the wrapper */}
            <div className="absolute inset-0 z-10 flex items-end justify-center pb-3 pointer-events-none">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-black/60 text-white px-3 py-1.5 rounded-full text-[11px] font-medium flex items-center gap-1.5 select-none">
                {zoomed
                  ? <><Minimize2 className="h-3 w-3" /> Click to restore</>
                  : <><Maximize2 className="h-3 w-3" /> Click to zoom</>}
              </span>
            </div>
            {/* Transparent overlay — absorbs right-click "Save image as" */}
            <div
              className="absolute inset-0 z-10"
              onContextMenu={blockContext}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
