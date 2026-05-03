"use client";

import { useState } from "react";
import Image from "next/image";

import { Icons } from "@/components/common/icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DocumentViewerModal,
  type DocumentPage,
} from "@/components/experience/document-viewer-modal";

const PREVIEW_IMG = "/ren-letter-preview.png";

// ── Letter pages shown in the modal ──────────────────────────────────────────
// Watermarked + contact info redacted. Swap filenames here if images are updated.
const LETTER_PAGES: DocumentPage[] = [
  {
    src: "/Ren-Reference-Letter-images-0.jpg",
    alt: "Recommendation letter from Ren Sayer — Page 1 of 2",
  },
  {
    src: "/Ren-Reference-Letter-images-1.jpg",
    alt: "Recommendation letter from Ren Sayer — Page 2 of 2",
  },
];

const RESULTS = [
  { value: "50%", label: "Faster first drafts" },
  { value: "30%", label: "Faster editing" },
  { value: "Up to 129%", label: "More content/month" },
];

export function RecommendationLetter() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="mt-12 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto">

          {/* ── Left column — 2/3 ─────────────────────────────────────────── */}
          <div className="flex-[2] flex flex-col gap-6 min-w-0">

            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Icons.post className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Ren Sayer</p>
                <p className="text-sm text-muted-foreground">
                  Head of AI Research, Webselenese
                </p>
              </div>
            </div>

            {/* Quote excerpt */}
            <blockquote className="pl-5 border-l-2 border-border text-foreground/80 leading-relaxed text-sm sm:text-base italic">
              &ldquo;In his tenure, Anshul developed and refined a suite of HARPA AI commands
              (automations) that played a pivotal role in our content operations.
              He continuously maintained and updated them to keep pace with rapid
              AI advancements and evolving company requirements. These were not
              off-the-shelf automations, but purpose-built systems tailored to our
              internal workflows, integrating different APIs and webhooks for
              precise, scalable results. I wholeheartedly recommend Anshul for any
              AI marketing or automation role that values strategic thinking,
              reliability, and consistently high-quality results.&rdquo;
            </blockquote>

            {/* Results callout */}
            <div className="grid grid-cols-3 gap-4 py-4 border-y border-border text-center">
              {RESULTS.map((r) => (
                <div key={r.label}>
                  <p className="font-calsans font-bold text-xl">{r.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{r.label}</p>
                </div>
              ))}
            </div>

            {/* CTA — opens modal, no PDF download */}
            <div>
              <button
                onClick={() => setOpen(true)}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                aria-label="View full recommendation letter"
              >
                <Icons.externalLink className="h-4 w-4 mr-2" />
                Read Full Recommendation Letter
              </button>
            </div>

          </div>

          {/* ── Right column — 1/3 ────────────────────────────────────────── */}
          <div className="lg:w-64 xl:w-72 shrink-0 w-full">
            {/* Thumbnail — clicking opens the modal */}
            <button
              onClick={() => setOpen(true)}
              className="group relative block w-full rounded-xl overflow-hidden border border-border shadow-sm cursor-zoom-in"
              aria-label="View full recommendation letter"
            >
              <Image
                src={PREVIEW_IMG}
                alt="Recommendation letter preview — Ren Sayer, Head of AI Research, Webselenese"
                width={900}
                height={1200}
                className="w-full h-auto object-top object-cover"
                style={{ objectPosition: "top" }}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-black rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2 shadow">
                  <Icons.externalLink className="h-4 w-4" />
                  View Full Letter
                </span>
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* Document viewer modal — rendered at root level via portal-like z-index */}
      {open && (
        <DocumentViewerModal
          pages={LETTER_PAGES}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
