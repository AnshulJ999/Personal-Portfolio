"use client"

import { motion } from "framer-motion"
import * as React from "react"

import { cn } from "@/lib/utils"

// ─── Types ───────────────────────────────────────────────────────────────────
export interface SectionEntry {
  id: string
  label: string
  /** Compact label for gutter display. Falls back to label if absent. Full label always used for aria-label. */
  shortLabel?: string
  /** If true, visually indent this item (used for h3 headings in blog ToC) */
  indent?: boolean
}

interface SectionNavProps {
  sections: SectionEntry[]
  /** If true, clicking the first section scrolls to page top instead of to the element */
  firstScrollsToTop?: boolean
  /** If true, 2xl+ sidebar hides labels by default and shows them on hover (like dot nav) */
  labelsHidden?: boolean
  /** If true, tier 2 (line nav) labels are always visible — no scroll/hover reveal needed.
   *  Only pass this when shortLabels are present (compact enough to fit the gutter).
   *  Has no effect on tier 1 (dots) or tier 3 (sidebar). */
  persistentLabels?: boolean
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function scrollToSection(
  id: string,
  firstId: string,
  firstScrollsToTop: boolean
) {
  if (firstScrollsToTop && id === firstId) {
    window.scrollTo({ top: 0, behavior: "smooth" })
    return
  }
  const el = document.getElementById(id)
  if (!el) return
  const headerHeight = window.innerWidth >= 768 ? 80 : 56
  const top = el.getBoundingClientRect().top + window.scrollY - headerHeight
  window.scrollTo({ top, behavior: "smooth" })
}

// ─── Component ───────────────────────────────────────────────────────────────
export function SectionNav({
  sections,
  firstScrollsToTop = false,
  labelsHidden = false,
  persistentLabels = false,
}: SectionNavProps) {
  const [mounted, setMounted] = React.useState(false)
  const [activeSection, setActiveSection] = React.useState<string>(
    sections[0]?.id ?? ""
  )
  const [isScrolling, setIsScrolling] = React.useState(false)
  const [isTier2Hovered, setIsTier2Hovered] = React.useState(false)
  const [hoveredSectionId, setHoveredSectionId] = React.useState<string | null>(null)

  React.useEffect(() => {
    setMounted(true)

    const observers = sections.map(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        {
          threshold: 0.15,
          rootMargin: `${window.innerWidth >= 768 ? -80 : -56}px 0px -30% 0px`,
        }
      )
      obs.observe(el)
      return obs
    }).filter(Boolean)

    return () => observers.forEach((obs) => obs?.disconnect())
  }, [sections])

  /* Scroll detection for Tier 2 label reveal — passive listener, debounced */
  React.useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const onScroll = () => {
      setIsScrolling(true)
      clearTimeout(timeout)
      timeout = setTimeout(() => setIsScrolling(false), 700)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      clearTimeout(timeout)
    }
  }, [])

  const tier2LabelsVisible = isScrolling || isTier2Hovered
  // persistentLabels: always show labels (short labels confirmed to fit gutter)
  // labelsHidden: scroll must NOT expand (long headings would overflow gutter)
  // default: scroll or hover reveals labels
  const tier2ShouldReveal = persistentLabels || (labelsHidden ? isTier2Hovered : tier2LabelsVisible)

  if (!mounted || sections.length === 0) return null

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5, delay: 0.4, ease: "easeOut" as const },
  }

  const firstId = sections[0].id

  return (
    <>
      {/* ────────────────────────────────────────────────────────────────────
          DOT NAV  —  < 1440 px  (mobile, tablet, smaller desktops)
          • Tiny dots on the left edge
          • Labels on hover only, uppercase
          • Active dot is larger + foreground colour
      ──────────────────────────────────────────────────────────────────── */}
      <motion.nav
        aria-label="Page sections"
        className="min-[1280px]:hidden fixed left-3 z-50 flex flex-col items-start gap-4"
        style={{ top: "50%", transform: "translateY(-50%)" }}
        {...fadeIn}
      >
        {sections.map(({ id, label, shortLabel, indent }) => {
          const isActive = activeSection === id
          return (
            <button
              key={id}
              onClick={() => scrollToSection(id, firstId, firstScrollsToTop)}
              aria-label={`Go to ${label}`}
              className={cn("group flex items-center gap-2", indent && "ml-3")}
            >
              {/* Dot */}
              <span
                className={cn(
                  "rounded-full shrink-0 transition-all duration-200",
                  isActive
                    ? "w-2.5 h-2.5 bg-foreground"
                    : "w-1.5 h-1.5 bg-foreground/25 group-hover:w-2 group-hover:h-2 group-hover:bg-foreground/55",
                  indent && !isActive && "w-1 h-1"
                )}
              />

              {/* Label — hover only, uppercase */}
              <span
                className={cn(
                  "text-[10px] font-semibold tracking-widest uppercase whitespace-nowrap",
                  "transition-all duration-200",
                  "opacity-0 -translate-x-1",
                  "group-hover:opacity-100 group-hover:translate-x-0",
                  isActive ? "text-foreground" : "text-foreground/60"
                )}
              >
                {shortLabel ?? label}
              </span>
            </button>
          )
        })}
      </motion.nav>

      {/* ────────────────────────────────────────────────────────────────────
          LINE NAV  —  1280 px to 1630 px  (mid-desktop)
          • Idle: thin lines only (fit within 32px gutter)
          • Scroll / hover: lines collapse, labels fade in at the same position
          • Labels replace lines — no additive width
          • pr-16 extends invisible hover zone for easy mouse access
      ──────────────────────────────────────────────────────────────────── */}
      <motion.nav
        aria-label="Page sections"
        className="hidden min-[1280px]:flex min-[1630px]:hidden fixed left-3 z-50 flex-col items-start gap-4 pr-16"
        style={{ top: "50%", transform: "translateY(-50%)" }}
        onMouseEnter={() => setIsTier2Hovered(true)}
        onMouseLeave={() => setIsTier2Hovered(false)}
        {...fadeIn}
      >
        {sections.map(({ id, label, shortLabel, indent }, index) => {
          const isActive = activeSection === id
          return (
            <button
              key={id}
              onClick={() => scrollToSection(id, firstId, firstScrollsToTop)}
              aria-label={`Go to ${label}`}
              onMouseEnter={() => persistentLabels && setHoveredSectionId(id)}
              onMouseLeave={() => persistentLabels && setHoveredSectionId(null)}
              className={cn(
                "group flex items-center cursor-pointer",
                persistentLabels && "gap-2",
                indent && "ml-3"
              )}
            >
              {/* Line — collapses when labels are visible.
                  In persistentLabels mode: 3-state stub matching Tier 3's proportional scale.
                  Inactive 8px / hovered 12px / active 18px. Color also steps up per state. */}
              <motion.span
                animate={{
                  width: persistentLabels
                    ? (isActive ? 26 : hoveredSectionId === id ? 18 : 10)
                    : (tier2ShouldReveal ? 0 : isActive ? 16 : indent ? 8 : 12),
                  opacity: persistentLabels ? 1 : (tier2ShouldReveal ? 0 : 1),
                }}
                transition={{
                  duration: 0.3,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className={cn(
                  "block h-px shrink-0",
                  persistentLabels
                    ? isActive
                      ? "bg-foreground"
                      : hoveredSectionId === id
                        ? "bg-foreground/50"
                        : "bg-foreground/25"
                    : isActive
                      ? "bg-foreground"
                      : indent
                        ? "bg-foreground/20"
                        : "bg-foreground/25"
                )}
              />
              {/* Label — fades in as line collapses, staggered entrance */}
              <motion.span
                animate={{
                  opacity: tier2ShouldReveal ? 1 : 0,
                  x: tier2ShouldReveal ? 0 : -4,
                }}
                transition={{
                  duration: tier2LabelsVisible ? 0.4 : 0.4,
                  delay: tier2LabelsVisible ? 0.2 + index * 0.05 : 0,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className={cn(
                  "text-[10px] font-bold tracking-widest uppercase whitespace-nowrap",
                  isActive
                    ? "text-foreground"
                    : "text-foreground/35 group-hover:text-foreground/60"
                )}
                style={{
                  pointerEvents: tier2ShouldReveal ? "auto" : "none",
                }}
              >
                {shortLabel ?? label}
              </motion.span>
            </button>
          )
        })}
      </motion.nav>

      {/* ────────────────────────────────────────────────────────────────────
          LEFT GUTTER SIDEBAR  —  ≥ 1620 px  (large desktop)
          Expanding line + label, Brittany Chiang style.
          When labelsHidden is true, labels behave like dot nav (hover-only).
      ──────────────────────────────────────────────────────────────────── */}
      <motion.nav
        aria-label="Page sections"
        className="hidden min-[1630px]:flex fixed left-6 z-40 flex-col justify-center gap-5"
        style={{ top: "50%", transform: "translateY(-50%)" }}
        {...fadeIn}
      >
        {sections.map(({ id, label, shortLabel, indent }) => {
          const isActive = activeSection === id
          return (
            <button
              key={id}
              onClick={() => scrollToSection(id, firstId, firstScrollsToTop)}
              aria-label={`Go to ${label}`}
              className={cn(
                "group flex items-center gap-3 cursor-pointer",
                indent && "ml-4"
              )}
            >
              {/* Expanding line (slightly compact to fit gutter) */}
              <span
                className={cn(
                  "block h-px transition-all duration-300 ease-in-out",
                  isActive
                    ? "w-12 bg-foreground"
                    : indent
                      ? "w-3 bg-foreground/20 group-hover:w-6 group-hover:bg-foreground/45"
                      : "w-5 bg-foreground/30 group-hover:w-8 group-hover:bg-foreground/55"
                )}
              />
              {/* Label */}
              <span
                className={cn(
                  "text-[10px] font-bold tracking-widest uppercase whitespace-nowrap transition-all duration-300",
                  labelsHidden
                    ? cn(
                        "opacity-0 -translate-x-1",
                        "group-hover:opacity-100 group-hover:translate-x-0",
                        isActive ? "text-foreground" : "text-foreground/60"
                      )
                    : cn(
                        isActive
                          ? "text-foreground"
                          : "text-foreground/35 group-hover:text-foreground/65"
                      )
                )}
              >
                {shortLabel ?? label}
              </span>
            </button>
          )
        })}
      </motion.nav>
    </>
  )
}
