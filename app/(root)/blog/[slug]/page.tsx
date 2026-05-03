import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import Script from "next/script"
import { MDXRemote } from "next-mdx-remote/rsc"

import { AnimatedSection } from "@/components/common/animated-section"
import { AnimatedText } from "@/components/common/animated-text"
import { ClientPageWrapper } from "@/components/common/client-page-wrapper"
import { Icons } from "@/components/common/icons"
import { SectionNav } from "@/components/common/section-nav"
import { GiscusComments } from "@/components/blog/giscus-comments"
import { ShareButtons } from "@/components/blog/share-buttons"
import { ZoomableImage } from "@/components/blog/zoomable-image"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import {
  getAllPosts,
  getHeadingsFromContent,
  getPostBySlug,
  slugify,
} from "@/lib/posts"
import { cn } from "@/lib/utils"

// ─── Feature flags ────────────────────────────────────────────────────────────
const SHOW_BREADCRUMB = true
const SHOW_TAGS = false              // separate pill row above the title
const SHOW_TAGS_IN_METADATA = true  // tags in the metadata row
const TAGS_RIGHT_ALIGNED = true     // true = Approach B (ml-auto, right side); false = Approach A (inline after reading time)
const TOC_LABELS_PERSISTENT = true  // true = tier 2 labels always visible; false = scroll/hover reveal

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: "Post Not Found" }

  const ogImage = post.coverImage
    ? post.coverImage.startsWith("http")
      ? post.coverImage
      : `${siteConfig.url}${post.coverImage}`
    : siteConfig.ogImage
  const isoDate = new Date(post.date).toISOString()

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: siteConfig.authorName, url: siteConfig.url }],
    keywords: post.tags,
    alternates: {
      canonical: `${siteConfig.url}/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${siteConfig.url}/blog/${slug}`,
      siteName: siteConfig.name,
      type: "article",
      publishedTime: isoDate,
      modifiedTime: isoDate,
      authors: [siteConfig.authorName],
      tags: post.tags,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImage],
      creator: `@${siteConfig.username}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

// ─── MDX component overrides ──────────────────────────────────────────────────
// Article title (JSX h1) uses font-heading (EB Garamond) — kept for the big title.
// In-article headings (h1/h2/h3 via MDX) use font-sans (Inter) for readability.
const components = {
  h1: (props: any) => (
    <h1 className="font-sans text-3xl font-bold mt-8 mb-4" {...props} />
  ),
  h2: (props: any) => (
    <h2
      id={slugify(String(props.children ?? ""))}
      className="font-sans text-2xl font-semibold mt-8 mb-3 border-b border-border pb-1 scroll-mt-24"
      {...props}
    />
  ),
  h3: (props: any) => (
    <h3
      id={slugify(String(props.children ?? ""))}
      className="font-sans text-xl font-semibold mt-6 mb-2 scroll-mt-24"
      {...props}
    />
  ),
  p: (props: any) => (
    <div className="leading-7 text-foreground/80 mb-4" {...props} />
  ),
  a: (props: any) => (
    <a
      className="text-ring underline underline-offset-2 hover:opacity-80"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={
        props.href?.startsWith("http")
          ? "noopener noreferrer nofollow"
          : undefined
      }
      {...props}
    />
  ),
  ul: (props: any) => (
    <ul className="list-disc pl-6 mb-4 space-y-1 text-foreground/80" {...props} />
  ),
  ol: (props: any) => (
    <ol className="list-decimal pl-6 mb-4 space-y-1 text-foreground/80" {...props} />
  ),
  li: (props: any) => <li className="leading-7" {...props} />,
  blockquote: (props: any) => (
    <blockquote
      className="border-l-4 border-ring pl-4 italic text-muted-foreground my-4"
      {...props}
    />
  ),
  code: (props: any) => (
    <code
      className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
      {...props}
    />
  ),
  pre: (props: any) => (
    <pre
      className="bg-muted p-4 rounded-xl overflow-x-auto text-sm font-mono my-4"
      {...props}
    />
  ),
  img: (props: any) => <ZoomableImage src={props.src} alt={props.alt} />,
  hr: () => <hr className="border-border my-8" />,
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const headings = getHeadingsFromContent(post.content)
  const hasTocLabels = Object.keys(post.tocLabels ?? {}).length > 0
  const tocSections = headings
    .filter((h) => h.level === 2)
    .map((h) => ({
      id: h.id,
      label: h.text,
      shortLabel: post.tocLabels?.[h.id],
    }))

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
  const shortDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  const isoDate = new Date(post.date).toISOString()
  const ogImage = post.coverImage
    ? post.coverImage.startsWith("http")
      ? post.coverImage
      : `${siteConfig.url}${post.coverImage}`
    : siteConfig.ogImage

  const blogPostSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: isoDate,
    dateModified: isoDate,
    author: {
      "@type": "Person",
      name: siteConfig.authorName,
      url: siteConfig.url,
      sameAs: [siteConfig.links.github, siteConfig.links.twitter],
    },
    publisher: { "@type": "Person", name: siteConfig.authorName, url: siteConfig.url },
    url: `${siteConfig.url}/blog/${slug}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteConfig.url}/blog/${slug}` },
    image: ogImage,
    keywords: post.tags?.join(", ") ?? "",
    ...(post.readingTime && { timeRequired: `PT${post.readingTime}M` }),
    inLanguage: "en-US",
    isPartOf: {
      "@type": "Blog",
      name: `${siteConfig.authorName}'s Blog`,
      url: `${siteConfig.url}/blog`,
    },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${siteConfig.url}/blog/${slug}` },
    ],
  }

  return (
    <ClientPageWrapper>
      <Script
        id="schema-blog-post"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostSchema) }}
      />
      <Script
        id="schema-breadcrumb-post"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-6">

        {/* Breadcrumb — SHOW_BREADCRUMB = false to hide */}
        {SHOW_BREADCRUMB && (
          <AnimatedText delay={0}>
            <nav aria-label="Breadcrumb" className="mb-5">
              <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-foreground transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">
                  <Icons.chevronRight className="w-3.5 h-3.5" />
                </li>
                <li>
                  <Link href="/blog" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li aria-hidden="true">
                  <Icons.chevronRight className="w-3.5 h-3.5" />
                </li>
                <li
                  className="text-foreground font-medium truncate max-w-[300px] sm:max-w-lg"
                  aria-current="page"
                >
                  {post.title}
                </li>
              </ol>
            </nav>
          </AnimatedText>
        )}

        {/* Article header */}
        <AnimatedSection direction="up">
          <header className="mb-6">

            {/* Tags — SHOW_TAGS = false to hide */}
            {SHOW_TAGS && post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* H1 title — EB Garamond for the main article title */}
            <h1 className="font-sans font-semibold text-3xl sm:text-4xl md:text-5xl leading-tight text-foreground mb-3">
              {post.title}
            </h1>

            {/* Description as lead paragraph */}
            {post.description && (
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                {post.description}
              </p>
            )}

            {/* Author + date + reading time */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-muted-foreground pb-4 border-b border-border">
              <address className="flex items-center gap-1.5 not-italic">
                <Icons.user className="w-4 h-4" />
                <a
                  rel="author"
                  href={siteConfig.url}
                  className="hover:text-foreground transition-colors"
                >
                  {siteConfig.authorName}
                </a>
              </address>
              {/* Mobile: abbreviated date */}
              <time dateTime={isoDate} className="sm:hidden flex items-center gap-1.5">
                <Icons.calendar className="w-4 h-4" />
                {shortDate}
              </time>
              {/* Desktop: full date */}
              <time dateTime={isoDate} className="hidden sm:flex items-center gap-1.5">
                <Icons.calendar className="w-4 h-4" />
                {formattedDate}
              </time>
              {post.readingTime && (
                <>
                  {/* Mobile: shorter label */}
                  <span className="sm:hidden flex items-center gap-1.5">
                    <Icons.clock className="w-4 h-4" />
                    {post.readingTime} min
                  </span>
                  {/* Desktop: full label */}
                  <span className="hidden sm:flex items-center gap-1.5">
                    <Icons.clock className="w-4 h-4" />
                    {post.readingTime} min read
                  </span>
                </>
              )}

              {/* Tags in metadata row — toggle SHOW_TAGS_IN_METADATA / TAGS_RIGHT_ALIGNED */}
              {SHOW_TAGS_IN_METADATA && post.tags && post.tags.length > 0 && (
                <div className={cn("hidden sm:flex items-center gap-1.5", TAGS_RIGHT_ALIGNED && "ml-auto")}>
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="whitespace-nowrap border border-border rounded px-1.5 py-0.5 text-sm text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>
        </AnimatedSection>

        {/* Cover image — hidden per post via hideCoverImage frontmatter */}
        {post.coverImage && !post.hideCoverImage && (
          <AnimatedSection direction="up" delay={0.05}>
            <figure className="mb-8">
              <Image
                src={post.coverImage}
                alt={post.title}
                width={768}
                height={400}
                className="w-full h-auto rounded-lg border border-border object-cover"
                priority
              />
            </figure>
          </AnimatedSection>
        )}

        {/* ToC — labelsHidden fallback for posts without tocLabels (long headings overflow gutter).
              persistentLabels: tier 2 labels always visible when short labels confirmed to fit.
              TOC_LABELS_PERSISTENT flag: flip to false to revert to scroll/hover reveal. */}
        {tocSections.length > 0 && (
          <SectionNav
            sections={tocSections}
            labelsHidden={!hasTocLabels}
            persistentLabels={TOC_LABELS_PERSISTENT && hasTocLabels}
          />
        )}

        {/* Article body — MDX */}
        <AnimatedSection direction="up" delay={0.1}>
          <div className="prose-none">
            <MDXRemote source={post.content} components={components} />
          </div>
        </AnimatedSection>

        {/* Footer */}
        <AnimatedSection
          direction="up"
          delay={0.15}
          className="mt-16 pt-8 border-t border-border"
        >
          <footer className="flex items-center justify-between">
            <Link
              href="/blog"
              className={cn(buttonVariants({ variant: "outline" }), "rounded-lg gap-2")}
            >
              <Icons.chevronLeft className="w-4 h-4" />
              All posts
            </Link>
            <div className="text-sm text-muted-foreground">
              Written by{" "}
              <Link
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:text-primary transition-colors"
              >
                {siteConfig.authorName}
              </Link>
            </div>
          </footer>
        </AnimatedSection>

        {/* Share buttons — right gutter (desktop) + inline row (mobile) */}
        <ShareButtons url={`${siteConfig.url}/blog/${slug}`} title={post.title} />

        {/* Comments — Giscus (GitHub Discussions backed) */}
        <GiscusComments />

      </article>
    </ClientPageWrapper>
  )
}
