"use client"

import { SectionNav } from "@/components/common/section-nav"

const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "testimonials", label: "Testimonials" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "creative", label: "More" },
] as const

export function HomeSectionNav() {
  return <SectionNav sections={[...SECTIONS]} firstScrollsToTop />
}
