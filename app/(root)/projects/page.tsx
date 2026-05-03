import { Metadata } from "next";

import PageContainer from "@/components/common/page-container";
import { SectionNav } from "@/components/common/section-nav";
import { FeaturedProjectsList } from "@/components/projects/featured-projects-list";
import ProjectCard from "@/components/projects/project-card";
import { pagesConfig } from "@/config/pages";
import { featuredProjects, regularProjects } from "@/config/projects";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: pagesConfig.projects.metadata.title,
  description: pagesConfig.projects.metadata.description,
  alternates: {
    canonical: `${siteConfig.url}/projects`,
  },
};

export default function ProjectsPage() {
  const sections = [
    ...featuredProjects.map((p) => ({ id: p.id, label: p.shortName ?? p.companyName })),
    ...(regularProjects.length > 0
      ? [{ id: "more-projects", label: "More Projects" }]
      : []),
  ]

  return (
    <PageContainer
      title={pagesConfig.projects.title}
      description={pagesConfig.projects.description}
    >
      <SectionNav sections={sections} />
      <div className="flex flex-col gap-8 mt-4">
        {/* ── Tier 1: Featured projects (full-width) ─────────────────── */}
        {featuredProjects.length > 0 && (
          <FeaturedProjectsList projects={featuredProjects} />
        )}

        {/* ── Tier 2: Regular projects (2-col grid) ──────────────────── */}
        {regularProjects.length > 0 && (
          <section id="more-projects">
            {featuredProjects.length > 0 && (
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                More Projects
              </h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
              {regularProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>
        )}
      </div>
    </PageContainer>
  );
}
