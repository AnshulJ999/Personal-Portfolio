import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import Script from "next/script";

import { AnimatedSection } from "@/components/common/animated-section";
import { Icons } from "@/components/common/icons";
import { ZoomableImage } from "@/components/blog/zoomable-image";
import PageContainer from "@/components/common/page-container";
import { SectionNav } from "@/components/common/section-nav";
import { buttonVariants } from "@/components/ui/button";
import { getAllPosts, getHeadingsFromContent, getPostBySlug, slugify } from "@/lib/posts";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const ogImage = post.coverImage
    ? post.coverImage.startsWith("http")
      ? post.coverImage
      : `${siteConfig.url}${post.coverImage}`
    : siteConfig.ogImage;
  const isoDate = new Date(post.date).toISOString();
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
  };
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// MDX component overrides — styled to match the site palette
const components = {
  h1: (props: any) => (
    <h1 className="font-heading text-3xl font-bold mt-8 mb-4" {...props} />
  ),
  h2: (props: any) => (
    <h2
      id={slugify(String(props.children ?? ""))}
      className="font-heading text-2xl font-semibold mt-8 mb-3 border-b border-border pb-1 scroll-mt-24"
      {...props}
    />
  ),
  h3: (props: any) => (
    <h3
      id={slugify(String(props.children ?? ""))}
      className="font-heading text-xl font-semibold mt-6 mb-2 scroll-mt-24"
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
      rel={props.href?.startsWith("http") ? "noopener noreferrer nofollow" : undefined}
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
};

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const headings = getHeadingsFromContent(post.content)
  const tocSections = headings
    .filter((h) => h.level === 2)
    .map((h) => ({ id: h.id, label: h.text }))

  const isoDate = new Date(post.date).toISOString()
  const ogImage = post.coverImage
    ? post.coverImage.startsWith("http")
      ? post.coverImage
      : `${siteConfig.url}${post.coverImage}`
    : siteConfig.ogImage;

  const blogPostingSchema = {
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
    <>
      <Script
        id="schema-blog-post"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <Script
        id="schema-breadcrumb-post"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageContainer title={post.title} description={formatDate(post.date)}>
        {/* Breadcrumb nav */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <Icons.chevronRight className="h-3 w-3" />
            </li>
            <li>
              <Link href="/blog" className="hover:text-foreground transition-colors">
                Blog
              </Link>
            </li>
            <li aria-hidden="true">
              <Icons.chevronRight className="h-3 w-3" />
            </li>
            <li
              className="text-foreground font-medium truncate max-w-[200px] sm:max-w-xs"
              aria-current="page"
            >
              {post.title}
            </li>
          </ol>
        </nav>

        {tocSections.length > 0 && <SectionNav sections={tocSections} labelsHidden />}

        {/* Tags + reading time */}
        {((post.tags && post.tags.length > 0) || post.readingTime) && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8">
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-medium uppercase tracking-wider bg-muted px-2 py-0.5 rounded-full text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {post.readingTime && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Icons.clock className="h-3 w-3 shrink-0" />
                {post.readingTime} min read
              </span>
            )}
          </div>
        )}

        {/* Post body */}
        <AnimatedSection direction="up">
          <article className="prose-none max-w-none">
            <MDXRemote source={post.content} components={components} />
          </article>
        </AnimatedSection>

        {/* Back link */}
        <div className="mt-12 pt-6 border-t border-border">
          <Link
            href="/blog"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            ← Back to Blog
          </Link>
        </div>
      </PageContainer>
    </>
  );
}
