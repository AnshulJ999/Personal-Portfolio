"use client"

import Giscus from "@giscus/react"
import { useTheme } from "next-themes"
import * as React from "react"

// ─── Giscus configuration ─────────────────────────────────────────────────────
// Public repo: github.com/AnshulJ999/blog-comments (holds Discussions only, no code)
// Source repo (website-portfolio) stays private — Giscus uses this separate public repo.
// IDs are public identifiers, not secrets — safe to hardcode.
const GISCUS_REPO = "your-github-username/blog-comments" as const
const GISCUS_REPO_ID = "your-giscus-repo-id"
const GISCUS_CATEGORY = "Announcements"
const GISCUS_CATEGORY_ID = "your-giscus-category-id"

// Map our 7 themes to Giscus light/dark
const DARK_THEMES = new Set(["dark", "cyberpunk", "synthwave", "aurora"])

export function GiscusComments() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Wait for theme to resolve before rendering — avoids hydration flash
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const giscusTheme = DARK_THEMES.has(resolvedTheme ?? "") ? "dark" : "light"

  return (
    <div className="mt-10 pt-8 border-t border-border">
      <Giscus
        repo={GISCUS_REPO}
        repoId={GISCUS_REPO_ID}
        category={GISCUS_CATEGORY}
        categoryId={GISCUS_CATEGORY_ID}
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={giscusTheme}
        lang="en"
        loading="lazy"
      />
    </div>
  )
}
