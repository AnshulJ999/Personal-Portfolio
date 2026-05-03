import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Icons } from "@/components/common/icons";
import { SectionNav } from "@/components/common/section-nav";
import MetricsRow from "@/components/projects/metrics-row";
import ProjectDescription from "@/components/projects/project-description";
import ScreenshotGallery from "@/components/projects/screenshot-gallery";
import VideoEmbed from "@/components/projects/video-embed";
import { buttonVariants } from "@/components/ui/button";
import ChipContainer from "@/components/ui/chip-container";
import CustomTooltip from "@/components/ui/custom-tooltip";
import { Projects } from "@/config/projects";
import { siteConfig } from "@/config/site";
import { cn, formatDateFromObj } from "@/lib/utils";
import profileImg from "@/public/profile-img.jpg";

interface ProjectPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { projectId } = await params
  const project = Projects.find((val) => val.id === projectId)

  if (!project) return {}

  return {
    title: project.companyName,
    description: project.shortDescription,
    alternates: {
      canonical: `${siteConfig.url}/projects/${project.id}`,
    },
    openGraph: {
      title: `${project.companyName} | ${siteConfig.name}`,
      description: project.shortDescription,
      type: "article",
      url: `${siteConfig.url}/projects/${project.id}`,
      images: [
        {
          url: project.coverImage
            ? typeof project.coverImage === "string"
              ? project.coverImage
              : siteConfig.ogImage
            : siteConfig.ogImage,
          alt: project.companyName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.companyName} | ${siteConfig.name}`,
      description: project.shortDescription,
    },
  }
}

export default async function Project({ params }: ProjectPageProps) {
  const { projectId } = await params;
  const project = Projects.find((val) => val.id === projectId);
  if (!project) {
    redirect("/projects");
  }

  const projectIndex = Projects.indexOf(project);
  const prevProject = Projects[(projectIndex - 1 + Projects.length) % Projects.length];
  const nextProject = Projects[(projectIndex + 1) % Projects.length];

  const hasVideo = !!project.video;
  const hasScreenshots = (project.screenshots?.length ?? 0) > 0;
  const hasMetrics = (project.metrics?.length ?? 0) > 0;

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "about", label: "About" },
    ...(hasScreenshots ? [{ id: "screenshots", label: "Screenshots" }] : []),
  ]

  return (
    <article className="container relative max-w-3xl py-6 lg:py-10">
      <SectionNav sections={sections} />
      {/* Back link (sidebar on xl+) */}
      <Link
        href="/projects"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-[-200px] top-14 hidden xl:inline-flex"
        )}
      >
        <Icons.chevronLeft className="mr-2 h-4 w-4" />
        All Projects
      </Link>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div id="overview">
        <p className="text-sm text-muted-foreground">
          {formatDateFromObj(project.startDate)} – {formatDateFromObj(project.endDate, { showPresent: true })}
        </p>

        <h1 className="flex items-center justify-between mt-2 font-heading text-4xl leading-tight lg:text-5xl">

          {project.companyName}
          <div className="flex items-center">
            {project.githubLink && (
              <CustomTooltip text="View source code on GitHub">
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  <Icons.gitHub className="w-6 ml-4 text-muted-foreground hover:text-foreground transition-colors" />
                </a>
              </CustomTooltip>
            )}
            {project.websiteLink && (
              <CustomTooltip text="Visit live site. Some links may be temporarily unavailable.">
                <a
                  href={project.websiteLink}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  <Icons.externalLink className="w-6 ml-4 text-muted-foreground hover:text-foreground transition-colors" />
                </a>
              </CustomTooltip>
            )}
          </div>
        </h1>

        {project.role && (
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            Role: {project.role}
          </p>
        )}

        <ChipContainer textArr={project.category} />

        {/* Author row */}
        <div className="mt-4 flex space-x-4">
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="flex items-center space-x-2 text-sm"
          >
            <Image
              src={profileImg}
              alt={"Anshul Jain"}
              width={42}
              height={42}
              className="rounded-full bg-background"
            />
            <div className="flex-1 text-left leading-tight">
              <p className="font-medium">{siteConfig.authorName}</p>
              <p className="text-[12px] text-muted-foreground">
                @{siteConfig.username}
              </p>
            </div>
          </a>
        </div>
      </div>

      {/* ── Hero: video if available, otherwise cover image ──────────── */}
      <div className="my-8">
        {hasVideo ? (
          <VideoEmbed video={project.video!} />
        ) : (
          <div className="w-full overflow-hidden rounded-md border bg-muted transition-colors">
            <Image
              src={project.coverImage ?? project.companyLogoImg}
              alt={project.companyName}
              width={1200}
              height={675}
              sizes="(max-width: 768px) 100vw, 900px"
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        )}
      </div>

      {/* ── Key Metrics ───────────────────────────────────────────────────── */}
      {hasMetrics && (
        <div id="results" className="mb-7">
          <h2 className="inline-block font-heading text-3xl leading-tight lg:text-3xl mb-3">
            Stats
          </h2>
          <MetricsRow metrics={project.metrics!} />
        </div>
      )}

      {/* ── Tech Stack ───────────────────────────────────────────────────── */}
      <div id="tech-stack" className="mb-7">
        <h2 className="inline-block font-heading text-3xl leading-tight lg:text-3xl mb-2">
          Tech Stack
        </h2>
        <ChipContainer textArr={project.techStack} />
      </div>

      {/* ── Description ──────────────────────────────────────────────────── */}
      <div id="about" className="mb-7">
        <h2 className="inline-block font-heading text-3xl leading-tight lg:text-3xl mb-2">
          About This Project
        </h2>
        <ProjectDescription
          paragraphs={project.descriptionDetails.paragraphs}
          bullets={project.descriptionDetails.bullets}
        />
      </div>

      {/* ── Screenshots ──────────────────────────────────────────────────── */}
      {hasScreenshots && (
        <div id="screenshots" className="mb-7">
          <h2 className="inline-block font-heading text-3xl leading-tight lg:text-3xl mb-4">
            Screenshots
          </h2>
          <ScreenshotGallery
            screenshots={project.screenshots!}
            altPrefix={`${project.companyName} screenshot`}
            variant="grid"
          />
        </div>
      )}

      <hr className="mt-12" />
      <div className="flex items-center justify-between py-6 lg:py-10">
        <Link
          href={`/projects/${prevProject.id}`}
          className={cn(buttonVariants({ variant: "ghost" }), "gap-2")}
        >
          <Icons.chevronLeft className="h-4 w-4" />
          {prevProject.shortName ?? prevProject.companyName}
        </Link>
        <Link
          href="/projects"
          className={cn(buttonVariants({ variant: "ghost" }), "text-muted-foreground")}
        >
          All Projects
        </Link>
        <Link
          href={`/projects/${nextProject.id}`}
          className={cn(buttonVariants({ variant: "ghost" }), "gap-2")}
        >
          {nextProject.shortName ?? nextProject.companyName}
          <Icons.chevronRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
