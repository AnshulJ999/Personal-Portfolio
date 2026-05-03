import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

import { AnimatedSection } from "@/components/common/animated-section";
import { AnimatedText } from "@/components/common/animated-text";
import { ClientPageWrapper } from "@/components/common/client-page-wrapper";
import { Icons } from "@/components/common/icons";
import { PubList } from "@/components/home/pub-list";
import ExperienceCard from "@/components/experience/experience-card";
import ProjectCard from "@/components/projects/project-card";
import SkillsCard from "@/components/skills/skills-card";
import { HomeSectionNav } from "@/components/home/section-nav";
import { TestimonialsSection } from "@/components/testimonials/testimonials-section";
import { RecommendationLetter } from "@/components/experience/recommendation-letter";
import { Button, buttonVariants } from "@/components/ui/button";
import { experiences } from "@/config/experience";
import { bandcampCollab, spotifyCollabs } from "@/config/music";
import { pagesConfig } from "@/config/pages";
import { homepageProjects } from "@/config/projects";
import { siteConfig } from "@/config/site";
import { featuredSkills } from "@/config/skills";
import { testimonials } from "@/config/testimonials";
import { featuredPublications } from "@/config/writing";
import { getAllPosts } from "@/lib/posts";
import { cn } from "@/lib/utils";
import profileImg from "@/public/profile-img.jpg";

export const metadata: Metadata = {
  description: pagesConfig.home.metadata.description,
  alternates: {
    canonical: siteConfig.url,
  },
};

// ── Edit stats here. Keep them short and factual. ──────────────────────────
const STATS = [
  { value: "6+",        label: "Years of Experience" },
  { value: "50%",       label: "Time Saved on Average" },
  { value: "Up to 130%", label: "Output Increase" },
  { value: "100+",      label: "Successful Jobs" },    // ← change label here if needed
];

export default function IndexPage() {
  const latestPost = getAllPosts()[0] ?? null;
  const homeFeaturedPublications = [
    featuredPublications[0],
    featuredPublications[1],
    featuredPublications[3],
    featuredPublications[2],
    featuredPublications[4],
  ].filter(Boolean);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.authorName,
    url: siteConfig.url,
    image: siteConfig.ogImage,
    jobTitle: "AI Automation Specialist",
    sameAs: [
      siteConfig.links.github,
      siteConfig.links.twitter,
      siteConfig.links.linkedin,
      siteConfig.links.upwork,
    ],
  };

  return (
    <ClientPageWrapper>
      <Script
        id="schema-person"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section id="hero" className="space-y-6 pb-8 pt-6 mb-0 md:pb-12 min-h-[calc(100vh-3.5rem)] md:min-h-[calc(100vh-5rem)] flex items-center">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <Image
            src={profileImg}
            height={100}
            width={100}
            sizes="(max-width: 768px) 70vw, 480px"
            className="bg-primary rounded-full mb-0 h-auto md:mb-2 w-[60%] max-w-[16rem] border-8 border-primary"
            alt={`${siteConfig.authorName} — AI Automation Specialist Portfolio`}
            priority
          />
          <AnimatedText
            as="h1"
            delay={0.2}
            className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Anshul Jain
          </AnimatedText>
          <AnimatedText
            as="h3"
            delay={0.4}
            className="font-heading text-base sm:text-xl md:text-xl lg:text-2xl"
          >
            AI Automation Specialist
          </AnimatedText>
          <div className="mt-4 max-w-[42rem] text-center">
            <p className="leading-normal text-muted-foreground text-sm sm:text-base">
              I design and implement AI-driven automation workflows that solve
              real business problems. Top Rated Plus on Upwork with a 100% Job
              Success Score.
            </p>
          </div>

          <div className="flex flex-col mt-10 items-center justify-center sm:flex-row sm:space-x-4 gap-3">
            <AnimatedText delay={0.6}>
              <Link
                href={"/resume"}
                target="_blank"
                className={cn(buttonVariants({ size: "lg" }))}
                aria-label="Hire Anshul Jain on Upwork"
              >
                <Icons.upwork className="w-4 h-4 mr-2" /> Hire Me on Upwork
              </Link>
            </AnimatedText>
            <AnimatedText delay={0.8}>
              <Link
                href={"/contact"}
                rel="noreferrer"
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    size: "lg",
                  })
                )}
                aria-label="Get in touch with Anshul Jain"
              >
                <Icons.contact className="w-4 h-4 mr-2" /> Get in Touch
              </Link>
            </AnimatedText>
          </div>
          <AnimatedText delay={1.2}>
            <Link
              href="#content-start"
              className="mt-10 animate-bounce cursor-pointer hover:text-primary transition-colors block"
              aria-label="Scroll down to content"
            >
              <Icons.chevronDown className="h-6 w-6" />
            </Link>
          </AnimatedText>
          <div id="hero-sentinel" aria-hidden="true" />
        </div>
      </section>

      {/* Section navigator — floats on hero, sticks under nav when scrolled */}
      <HomeSectionNav />

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <AnimatedSection
        id="content-start"
        direction="up"
        className="container py-10 my-6 border-y border-border scroll-mt-20"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((stat, i) => (
            <div key={i}>
              <p className="font-calsans text-2xl sm:text-3xl font-bold text-foreground">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* ── Work / Projects ──────────────────────────────────────────────── */}
      <AnimatedSection
        direction="up"
        className="container space-y-6 py-10 my-14"
        id="projects"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <AnimatedText
            as="h2"
            className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl"
          >
            {pagesConfig.projects.title}
          </AnimatedText>
          <AnimatedText
            as="p"
            delay={0.2}
            className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7"
          >
            {pagesConfig.projects.description}
          </AnimatedText>
        </div>
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full items-stretch">
            {homepageProjects.map((exp, index) => (
              <AnimatedSection
                key={exp.id}
                delay={0.1 * (index + 1)}
                direction="up"
                className="h-full w-full min-w-0"
              >
                <ProjectCard project={exp} compact />
              </AnimatedSection>
            ))}
          </div>
        </div>
        <AnimatedText delay={0.4} className="flex justify-center">
          <Link href="/projects">
            <Button variant={"outline"} className="rounded-xl">
              <Icons.chevronDown className="mr-2 h-4 w-4" /> View All
            </Button>
          </Link>
        </AnimatedText>
      </AnimatedSection>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <AnimatedSection
        direction="up"
        className="container space-y-6 bg-muted py-10 my-14"
        id="testimonials"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <AnimatedText
            as="h2"
            className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl"
          >
            What Clients Say
          </AnimatedText>
          <AnimatedText
            as="p"
            delay={0.2}
            className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7"
          >
            From content writing and AI automation to guitar — real feedback
            from real clients.
          </AnimatedText>
        </div>
        <RecommendationLetter />
        <TestimonialsSection testimonials={testimonials.filter((t) => !t.hidden)} columns={2} />
        <div className="flex justify-center pt-2">
          <Link
            href="/testimonials"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground")}
          >
            See all testimonials →
          </Link>
        </div>
      </AnimatedSection>

      {/* ── Experience ───────────────────────────────────────────────────── */}
      <AnimatedSection
        direction="up"
        className="container space-y-6 py-10 my-14"
        id="experience"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <AnimatedText
            as="h2"
            className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl"
          >
            {pagesConfig.experience.title}
          </AnimatedText>
          <AnimatedText
            as="p"
            delay={0.2}
            className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7"
          >
            {pagesConfig.experience.description}
          </AnimatedText>
        </div>
        <div className="mx-auto grid justify-center gap-4 md:w-full lg:grid-cols-3">
          {experiences.slice(0, 6).map((experience, index) => (
            <AnimatedSection
              key={experience.id}
              delay={0.1 * (index + 1)}
              direction="up"
            >
              <ExperienceCard experience={experience} />
            </AnimatedSection>
          ))}
        </div>
        <AnimatedText delay={0.4} className="flex justify-center">
          <Link href="/experience">
            <Button variant={"outline"} className="rounded-xl">
              <Icons.chevronDown className="mr-2 h-4 w-4" /> View All
            </Button>
          </Link>
        </AnimatedText>
      </AnimatedSection>

      {/* ── Skills ───────────────────────────────────────────────────────── */}
      <AnimatedSection
        direction="up"
        className="container space-y-6 bg-muted py-10"
        id="skills"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <AnimatedText
            as="h2"
            className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl"
          >
            {pagesConfig.skills.title}
          </AnimatedText>
          <AnimatedText
            as="p"
            delay={0.2}
            className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7"
          >
            {pagesConfig.skills.description}
          </AnimatedText>
        </div>
        <SkillsCard skills={featuredSkills} />
        <AnimatedText delay={0.4} className="flex justify-center">
          <Link href="/skills">
            <Button variant={"outline"} className="rounded-xl">
              <Icons.chevronDown className="mr-2 h-4 w-4" /> View All
            </Button>
          </Link>
        </AnimatedText>
      </AnimatedSection>

      {/* ── Music & Writing ───────────────────────────────────────────────── */}
      <AnimatedSection
        direction="up"
        className="container space-y-6 py-10 my-14"
        id="creative"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <AnimatedText
            as="h2"
            className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl"
          >
            Music &amp; Writing
          </AnimatedText>
          <AnimatedText
            as="p"
            delay={0.2}
            className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7"
          >
            Guitar solos, featured publications, and the occasional deep-dive post.
          </AnimatedText>
        </div>

        {/* Bento: 2-col on lg+, stacked on mobile */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* LEFT – Music */}
          <AnimatedSection
            delay={0.1}
            direction="up"
            className="flex h-full flex-col rounded-2xl border border-border bg-card p-2 md:p-5"
          >
            <div className="flex flex-1 flex-col">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Music
                </p>
                <Link
                  href="/music"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  @TheShyGuitarist →
                </Link>
              </div>

              <div className="mt-4 flex flex-1 flex-col justify-between gap-4">
                {/* Spotify embeds */}
                {spotifyCollabs.map((track) => (
                  <div key={track.id} className="space-y-1.5">
                    <p className="text-xs leading-snug">
                      <span className="font-medium text-foreground">
                        {track.title}
                      </span>
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {track.artist}
                      <span className="mx-1.5 opacity-40">·</span>
                      <span>Solo: {track.soloTime}</span>
                    </p>
                    <iframe
                      src={`https://open.spotify.com/embed/track/${track.id}?utm_source=generator&theme=0`}
                      width="100%"
                      height="80"
                      style={{ border: 0 }}
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      className="rounded-xl"
                    />
                  </div>
                ))}

                {/* Bandcamp embed */}
                <div className="space-y-1.5">
                  <p className="text-xs leading-snug">
                    <span className="font-medium text-foreground">
                      {bandcampCollab.title}
                    </span>
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {bandcampCollab.artist}
                    <span className="mx-1.5 opacity-40">·</span>
                    <span>Solo: {bandcampCollab.soloTime}</span>
                  </p>
                  <iframe
                    src={bandcampCollab.embedSrc}
                    width="100%"
                    height="120"
                    style={{ border: 0 }}
                    allow="autoplay"
                    loading="lazy"
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>

            <Link
              href="/music"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "mt-auto pt-3 w-full justify-center text-muted-foreground"
              )}
            >
              Explore all music →
            </Link>
          </AnimatedSection>

          {/* RIGHT – Writing + Blog */}
          <AnimatedSection
            delay={0.2}
            direction="up"
            className="flex h-full flex-col gap-6"
          >
            {/* Writing – compact publication logos */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Writing
                </p>
                <Link
                  href="/writing"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  View all →
                </Link>
              </div>
              <PubList
                pubs={homeFeaturedPublications}
                logoToken={process.env.NEXT_PUBLIC_LOGODEV_TOKEN}
              />
            </div>

            {/* Blog – latest post */}
            {latestPost && (
              <div className="flex-1 rounded-2xl border border-border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-5 pt-4 pb-2">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Blog
                  </p>
                  <Link
                    href="/blog"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    View all →
                  </Link>
                </div>
                <Link
                  href={`/blog/${latestPost.slug}`}
                  className="group block"
                >
                  {latestPost.coverImage && (
                    <div className="relative h-40 w-full overflow-hidden">
                      <Image
                        src={latestPost.coverImage}
                        alt={latestPost.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-5 space-y-2">
                    {latestPost.date && (
                      <time className="text-xs text-muted-foreground">
                        {new Date(latestPost.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    )}
                    <p className="font-calsans text-base font-semibold text-foreground group-hover:text-ring transition-colors leading-tight line-clamp-2">
                      {latestPost.title}
                    </p>
                    {latestPost.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {latestPost.description}
                      </p>
                    )}
                    <span className="text-xs font-medium text-ring">
                      Read post →
                    </span>
                  </div>
                </Link>
              </div>
            )}
          </AnimatedSection>

        </div>
      </AnimatedSection>
    </ClientPageWrapper>
  );
}
