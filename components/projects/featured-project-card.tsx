"use client";

import Image from "next/image";
import Link from "next/link";

import { Icons } from "@/components/common/icons";
import MetricsRow from "@/components/projects/metrics-row";
import ProjectDescription from "@/components/projects/project-description";
import ScreenshotGallery from "@/components/projects/screenshot-gallery";
import VideoEmbed, { VideoPlaceholder } from "@/components/projects/video-embed";
import ChipContainer from "@/components/ui/chip-container";
import { ProjectInterface } from "@/config/projects";
import { formatDateFromObj } from "@/lib/utils";

interface FeaturedProjectCardProps {
  project: ProjectInterface;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

/**
 * Tier 1 — Full-width featured project block.
 * Shows: logo + title + badge, two-column (description+metrics | video),
 * screenshot gallery strip, and tech stack chips.
 * Optionally expands to show full project description inline.
 */
export default function FeaturedProjectCard({
  project,
  isExpanded = false,
  onToggleExpand,
}: FeaturedProjectCardProps) {
  const hasVideo = !!project.video;
  const hasScreenshots = (project.screenshots?.length ?? 0) > 0;
  const hasMetrics = (project.metrics?.length ?? 0) > 0;
  const hasAbout =
    project.descriptionDetails.paragraphs.length > 0 ||
    project.descriptionDetails.bullets.length > 0;

  // Which paragraphs to show in the collapsed preview (default: first paragraph)
  const previewIndices = project.previewParagraphs ?? [0];
  const previewTexts = previewIndices
    .map((i) => project.descriptionDetails.paragraphs[i])
    .filter(Boolean);
  // All paragraph indices NOT in the preview — shown on expand
  const remainingParagraphs = project.descriptionDetails.paragraphs.filter(
    (_, i) => !previewIndices.includes(i)
  );

  return (
    <article className="w-full rounded-2xl border border-border bg-card overflow-hidden">
      {/* ── Header band ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          {/* Logo — small icon for projects with a real logo, hidden if using hero coverImage */}
          {!project.coverImage && (
            <div className="relative w-9 h-9 flex-shrink-0">
              <Image
                src={project.companyLogoImg}
                alt={`${project.companyName} logo`}
                fill
                sizes="36px"
                className="object-contain"
              />
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold leading-tight text-foreground">
              <Link
                href={`/projects/${project.id}`}
                className="hover:text-ring transition-colors"
              >
                {project.companyName}
              </Link>
            </h2>
            {project.role && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {project.role}
                <span className="mx-1.5 opacity-40">·</span>
                {formatDateFromObj(project.startDate)} –{" "}
                {formatDateFromObj(project.endDate, { showPresent: true })}
              </p>
            )}
          </div>
        </div>

        {/* Badges */}
        <div className="hidden sm:flex items-center gap-2">
          {project.type === "Personal" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary border border-border text-muted-foreground">
              Personal
            </span>
          )}
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent border border-border text-foreground">
            {project.category[0]}
          </span>
        </div>
      </div>

      {/* ── Main body ───────────────────────────────────────────────────── */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left: description + metrics (below media on mobile) */}
          <div className="flex flex-col gap-5 order-2 lg:order-1">
            <p className="text-base text-muted-foreground leading-relaxed">
              {project.shortDescription}
            </p>

            {/* Expandable About section */}
            {hasAbout && (
              <div className="border-l-2 border-border pl-3">
                {/* Preview paragraphs — always visible, last one clamped when collapsed */}
                {previewTexts.length > 0 && (
                  isExpanded ? (
                    <div>
                      {previewTexts.map((text, i) => (
                        <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-4">
                          {text}
                        </p>
                      ))}
                    </div>
                  ) : onToggleExpand ? (
                    <button
                      type="button"
                      onClick={onToggleExpand}
                      className="w-full text-left cursor-pointer group"
                    >
                      {previewTexts.map((text, i) => (
                        <p
                          key={i}
                          className={`text-sm text-muted-foreground leading-relaxed${
                            i === previewTexts.length - 1 ? " line-clamp-4" : " mb-3"
                          }`}
                        >
                          {text}
                        </p>
                      ))}
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors mt-1.5">
                        Read More
                        <Icons.chevronDown className="w-3.5 h-3.5" />
                      </span>
                    </button>
                  ) : (
                    <div>
                      {previewTexts.map((text, i) => (
                        <p
                          key={i}
                          className={`text-sm text-muted-foreground leading-relaxed${
                            i === previewTexts.length - 1 ? " line-clamp-4" : " mb-3"
                          }`}
                        >
                          {text}
                        </p>
                      ))}
                    </div>
                  )
                )}

                {/* Remaining paragraphs + bullets — animated in/out */}
                <div
                  className="grid transition-[grid-template-rows] duration-500 ease-in-out"
                  style={{
                    gridTemplateRows: isExpanded ? "1fr" : "0fr",
                  }}
                >
                  <div className="overflow-hidden">
                    <div className="text-sm text-muted-foreground leading-relaxed">
                      {remainingParagraphs.map((paragraph, index) => (
                        <p className="mb-4" key={index}>
                          {paragraph}
                        </p>
                      ))}
                      {project.descriptionDetails.bullets.length > 0 && (
                        <ul className="list-disc pl-6 mt-4">
                          {project.descriptionDetails.bullets.map((bullet, index) => (
                            <li key={index}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
                {isExpanded && onToggleExpand && (
                  <button
                    type="button"
                    onClick={onToggleExpand}
                    className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer mt-1.5"
                  >
                    Show Less
                    <Icons.chevronUp className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {hasMetrics && (
              <MetricsRow metrics={project.metrics!} />
            )}

            {/* Links */}
            <div className="flex flex-wrap gap-3 mt-auto pt-2">
              <Link
                href={`/projects/${project.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
              >
                Full Details
                <Icons.chevronRight className="w-4 h-4" />
              </Link>
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-background text-sm font-medium hover:bg-accent transition-colors cursor-pointer"
                >
                  <Icons.gitHub className="w-4 h-4" />
                  GitHub
                </a>
              )}
              {project.websiteLink && (
                <a
                  href={project.websiteLink}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-background text-sm font-medium hover:bg-accent transition-colors cursor-pointer"
                >
                  <Icons.externalLink className="w-4 h-4" />
                  Live Site
                </a>
              )}
            </div>
          </div>

          {/* Right: video or cover image (above description on mobile) */}
          <div className="order-1 lg:order-2">
            {hasVideo ? (
              <VideoEmbed video={project.video!} />
            ) : project.coverImage ? (
              <div className="w-full overflow-hidden rounded-xl border border-border bg-muted">
                <Image
                  src={project.coverImage}
                  alt={`${project.companyName} visual`}
                  width={2560}
                  height={1180}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="w-full h-auto"
                />
              </div>
            ) : (
              <VideoPlaceholder />
            )}
          </div>
        </div>

        {/* ── Screenshot gallery ─────────────────────────────────────────── */}
        {hasScreenshots && (
          <div className="mt-6 pt-5 border-t border-border/60">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Screenshots
            </p>
            <ScreenshotGallery
              screenshots={project.screenshots!}
              altPrefix={`${project.companyName} screenshot`}
            />
          </div>
        )}

        {/* ── Tech stack ─────────────────────────────────────────────────── */}
        <div className="mt-5 pt-5 border-t border-border/60">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
            Tech Stack
          </p>
          <ChipContainer textArr={project.techStack} />
        </div>
      </div>
    </article>
  );
}
