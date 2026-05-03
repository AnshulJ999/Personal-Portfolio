"use client"

import { useCallback, useState } from "react"

import FeaturedProjectCard from "@/components/projects/featured-project-card"
import { ProjectInterface } from "@/config/projects"

interface FeaturedProjectsListProps {
  projects: ProjectInterface[]
  /**
   * Max number of cards that can be expanded simultaneously.
   * Set high (e.g. 10) to effectively disable accordion behavior
   * and let all cards stay open independently.
   * Lower to 2-3 to re-enable accordion (oldest card auto-collapses).
   *
   * NOTE: If you re-enable accordion (maxExpanded < total projects),
   * the auto-scroll logic below needs fixing — it currently fights
   * the collapse animation and causes jarring scroll jumps.
   */
  maxExpanded?: number
}

export function FeaturedProjectsList({
  projects,
  maxExpanded = 10,
}: FeaturedProjectsListProps) {
  const [expandedIds, setExpandedIds] = useState<string[]>([])

  const handleToggle = useCallback(
    (id: string) => {
      setExpandedIds((prev) => {
        if (prev.includes(id)) {
          return prev.filter((x) => x !== id)
        }
        const next = [...prev, id]
        if (next.length > maxExpanded) {
          next.shift()
        }
        // TODO: Auto-scroll is disabled. When accordion behavior is active
        // (maxExpanded < total projects), collapsing the evicted card shifts
        // the layout mid-animation, causing the scroll target to be wrong.
        // If re-enabling accordion, fix by either: (a) waiting for the
        // collapse animation to finish (~550ms) before scrolling, or
        // (b) only auto-scrolling when no eviction occurred.
        return next
      })
    },
    [maxExpanded]
  )

  return (
    <section className="flex flex-col gap-6">
      {projects.map((project) => (
        <div
          key={project.id}
          id={project.id}
        >
          <FeaturedProjectCard
            project={project}
            isExpanded={expandedIds.includes(project.id)}
            onToggleExpand={() => handleToggle(project.id)}
          />
        </div>
      ))}
    </section>
  )
}
