"use client"

import { motion } from "framer-motion"
import * as React from "react"

import { Icons } from "@/components/common/icons"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

// ─── Feature flags ────────────────────────────────────────────────────────────
const SHOW_HN = false // flip to true to show Hacker News share button

// ─── Types ────────────────────────────────────────────────────────────────────
interface ShareButtonsProps {
  url: string
  title: string
}

interface ShareButton {
  key: string
  label: string
  icon: React.ReactNode
  onClick: () => void
}

// ─── Single button ────────────────────────────────────────────────────────────
function ShareBtn({
  btn,
  copied,
}: {
  btn: ShareButton
  copied: boolean
}) {
  const isCopyBtn = btn.key === "copy"
  const isActive = isCopyBtn && copied
  const label = isActive ? "Copied!" : btn.label

  return (
    <button
      onClick={btn.onClick}
      title={label}
      aria-label={label}
      className={cn(
        "flex items-center justify-center w-9 h-9 rounded-lg",
        "transition-colors duration-200",
        "text-foreground/30 hover:text-foreground hover:bg-muted",
        isActive && "text-ring hover:text-ring"
      )}
    >
      {isActive
        ? <Icons.check className="w-4 h-4" />
        : btn.icon}
    </button>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────
export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [mounted, setMounted] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // Fallback for browsers without clipboard API
      const el = document.createElement("input")
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const enc = encodeURIComponent
  // Extract handle from full Twitter URL: "https://twitter.com/TheShyGuitarist" → "TheShyGuitarist"
  const twitterHandle = siteConfig.links.twitter.split("/").pop() ?? ""
  const tweetText = enc(`${title} — via @${twitterHandle}`)

  const buttons: ShareButton[] = [
    {
      key: "copy",
      label: "Copy link",
      icon: <Icons.link className="w-4 h-4" />,
      onClick: copyLink,
    },
    {
      key: "twitter",
      label: "Share on X",
      icon: <Icons.twitter className="w-3.5 h-3.5" />,
      onClick: () =>
        window.open(
          `https://twitter.com/intent/tweet?url=${enc(url)}&text=${tweetText}`,
          "_blank",
          "noopener,noreferrer,width=550,height=420"
        ),
    },
    {
      key: "linkedin",
      label: "Share on LinkedIn",
      icon: <Icons.linkedin className="w-4 h-4" />,
      onClick: () =>
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
          "_blank",
          "noopener,noreferrer,width=600,height=540"
        ),
    },
    ...(SHOW_HN
      ? [
          {
            key: "hn",
            label: "Share on Hacker News",
            icon: <Icons.hackerNews className="w-4 h-4" />,
            onClick: () =>
              window.open(
                `https://news.ycombinator.com/submitlink?u=${enc(url)}&t=${enc(title)}`,
                "_blank",
                "noopener,noreferrer"
              ),
          },
        ]
      : []),
  ]

  if (!mounted) return null

  return (
    <>
      {/* ── Desktop right gutter — fixed, vertical, ≥1280px ─────────────────
          Same fade-in timing as SectionNav. Opposite side (right-6 vs left-3).
          Hidden on mobile — replaced by the inline row below.               */}
      <motion.div
        className="hidden min-[1280px]:flex fixed right-6 z-40 flex-col gap-3"
        style={{ top: "50%", transform: "translateY(-50%)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
      >
        {buttons.map((btn) => (
          <ShareBtn key={btn.key} btn={btn} copied={copied} />
        ))}
      </motion.div>

      {/* ── Mobile / tablet — inline, horizontal, <1280px ───────────────────
          Sits between the article footer and Giscus comments.               */}
      <div className="min-[1280px]:hidden flex items-center gap-1 mt-8 pt-6 border-t border-border">
        <span className="text-xs font-medium text-muted-foreground mr-2">
          Share
        </span>
        {buttons.map((btn) => (
          <ShareBtn key={btn.key} btn={btn} copied={copied} />
        ))}
      </div>
    </>
  )
}
