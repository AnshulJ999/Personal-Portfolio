import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

import { AnimatedSection } from "@/components/common/animated-section";
import { Icons } from "@/components/common/icons";
import PageContainer from "@/components/common/page-container";
import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/config/site";

const DESCRIPTION =
  "Practical guides and thoughts on AI automation, LLM tooling, and the future of content operations."

export const metadata: Metadata = {
  title: "Blog",
  description: DESCRIPTION,
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
  openGraph: {
    title: `Blog | ${siteConfig.name}`,
    description: DESCRIPTION,
    url: `${siteConfig.url}/blog`,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.authorName} Blog`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Blog | ${siteConfig.name}`,
    description: DESCRIPTION,
    images: [siteConfig.ogImage],
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

export default function BlogPage() {
  const posts = getAllPosts();

  const blogListSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${siteConfig.authorName} — Blog`,
    description: DESCRIPTION,
    url: `${siteConfig.url}/blog`,
    isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
    author: { "@type": "Person", name: siteConfig.authorName, url: siteConfig.url },
    mainEntity: {
      "@type": "Blog",
      name: `${siteConfig.authorName}'s Blog`,
      url: `${siteConfig.url}/blog`,
      author: { "@type": "Person", name: siteConfig.authorName, url: siteConfig.url },
      blogPost: posts.map((post) => {
        const imageUrl = post.coverImage
          ? post.coverImage.startsWith("http")
            ? post.coverImage
            : `${siteConfig.url}${post.coverImage}`
          : undefined;

        return {
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: new Date(post.date).toISOString(),
          url: `${siteConfig.url}/blog/${post.slug}`,
          author: { "@type": "Person", name: siteConfig.authorName },
          keywords: post.tags?.join(", ") ?? "",
          ...(imageUrl && { image: imageUrl }),
        };
      }),
    },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/blog` },
    ],
  }

  return (
    <>
      <Script
        id="schema-blog-list"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }}
      />
      <Script
        id="schema-breadcrumb-blog"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageContainer
        title="Blog"
        description="Practical guides and thoughts on AI automation, LLM tooling, and the future of content operations."
      >
      {posts.length === 0 ? (
        <div className="rounded-xl border border-border bg-muted/40 py-16 text-center">
          <p className="text-muted-foreground text-sm">
            Posts coming soon. Check back shortly.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {posts.map((post, i) => (
            <AnimatedSection key={post.slug} direction="up" delay={0.08 * i}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row h-full">
                  {post.coverImage && (
                    <div className="relative w-full md:w-48 lg:w-64 h-48 md:h-auto shrink-0 overflow-hidden border-b md:border-b-0 md:border-r border-border">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 384px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex flex-col gap-2 p-6 justify-center">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {post.date && <time>{formatDate(post.date)}</time>}
                      {post.readingTime && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1">
                            <Icons.clock className="h-3 w-3 shrink-0" />
                            {post.readingTime} min read
                          </span>
                        </>
                      )}
                    </div>
                    <h2 className="font-calsans text-xl font-semibold text-foreground group-hover:text-ring transition-colors leading-tight">
                      {post.title}
                    </h2>
                    {post.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {post.description}
                      </p>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
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
                    <span className="mt-2 text-sm font-medium text-ring group-hover:underline">
                      Read post →
                    </span>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      )}
      </PageContainer>
    </>
  );
}
