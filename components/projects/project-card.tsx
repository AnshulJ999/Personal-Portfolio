import Image from "next/image";
import Link from "next/link";

import { Icons } from "@/components/common/icons";
import MetricsRow from "@/components/projects/metrics-row";
import ChipContainer from "@/components/ui/chip-container";
import { ProjectInterface } from "@/config/projects";

interface ProjectCardProps {
  project: ProjectInterface;
  compact?: boolean; // hides type badge, metrics, and tech stack (homepage use)
}

/**
 * Tier 2 — Regular project card used in the 2-column grid.
 * Shows: cover image/clip (if present) or logo fallback, title, type badge,
 * description, optional top metric, tech chips, and action links.
 */
export default function ProjectCard({ project, compact = false }: ProjectCardProps) {
  const hasMetrics = (project.metrics?.length ?? 0) > 0;

  return (
    <article className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden h-full cursor-pointer hover:border-border/70 hover:shadow-md transition-all duration-200">
      {/* ── Cover media ─────────────────────────────────────────────────── */}
      <Link href={`/projects/${project.id}`} className="block relative w-full h-44 overflow-hidden bg-muted flex-shrink-0">
        {project.shortClip ? (
          // Silent autoplay looping clip as cover
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          >
            {project.shortClipAv1 && (
              <source src={project.shortClipAv1} type='video/mp4; codecs="av01.0.05M.08"' />
            )}
            <source src={project.shortClip} type="video/mp4" />
          </video>
        ) : project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={`${project.companyName} cover`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          // Logo-based fallback — centred on a subtle gradient
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-secondary/60">
            <div className="relative w-16 h-16 opacity-60">
              <Image
                src={project.companyLogoImg}
                alt={`${project.companyName} logo`}
                fill
                sizes="64px"
                className="object-contain"
              />
            </div>
          </div>
        )}

        {/* Type badge overlay */}
        {!compact && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-background/85 backdrop-blur-sm border border-border text-foreground">
            {project.type === "Professional" ? (
              <Icons.work className="w-3 h-3" />
            ) : (
              <Icons.user className="w-3 h-3" />
            )}
            {project.type}
          </span>
        )}
      </Link>

      {/* ── Card body ───────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Title + category */}
        <div>
          <Link href={`/projects/${project.id}`}>
            <h3 className="text-lg font-bold leading-snug text-foreground group-hover:opacity-80 transition-opacity">
              {project.companyName}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5">
            {project.category.join(", ")}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">
          {project.shortDescription}
        </p>

        {/* Top metric (first only, if present) */}
        {!compact && hasMetrics && (
          <MetricsRow metrics={[project.metrics![0]]} />
        )}

        {/* Tech stack */}
        {!compact && <ChipContainer textArr={project.techStack} />}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/60 mt-auto">
          <Link
            href={`/projects/${project.id}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:opacity-70 transition-opacity cursor-pointer"
          >
            Read more
            <Icons.chevronRight className="w-3.5 h-3.5" />
          </Link>
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="ml-auto text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="View source on GitHub"
            >
              <Icons.gitHub className="w-4 h-4" />
            </a>
          )}
          {project.websiteLink && (
            <a
              href={project.websiteLink}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="ml-auto text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="Visit live site"
            >
              <Icons.externalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
