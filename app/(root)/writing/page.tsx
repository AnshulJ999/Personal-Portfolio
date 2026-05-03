import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AnimatedSection } from "@/components/common/animated-section";
import { Icons } from "@/components/common/icons";
import PageContainer from "@/components/common/page-container";
import { SectionNav } from "@/components/common/section-nav";
import { buttonVariants } from "@/components/ui/button";
import { FeaturedPublicationCard } from "@/components/writing/featured-publication-card";
import {
  WritingArticle,
  categoryLabels,
  featuredPublications,
  writingArticles,
} from "@/config/writing";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Published articles by Anshul Jain spanning AI & technology, music, health, solar energy, business, and more — written across multiple niches for various publications and independent clients.",
  alternates: {
    canonical: `${siteConfig.url}/writing`,
  },
};


// ── Category order for article sections ───────────────────────────────────────
const CATEGORY_ORDER: WritingArticle["category"][] = [
  "ai-tech",
  "music",
  "health-sleep",
  "solar",
  "business",
  "crypto",
  "other",
];

// ── Components ────────────────────────────────────────────────────────────────

function PublicationBadge({ name }: { name?: string }) {
  if (!name) return null;
  return (
    <span className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
      {name}
    </span>
  );
}


function ArticleCard({ article }: { article: WritingArticle }) {
  const isExternal = article.url.startsWith("http");
  const isPlaceholder = article.url === "#";
  const hasImage = Boolean(article.image);

  const cardClasses = cn(
    "group rounded-2xl border border-border bg-card flex flex-col overflow-hidden",
    "transition-all duration-300",
    !isPlaceholder && "hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
  );

  const inner = (
    <>
      {/* Image — only rendered when present */}
      {hasImage && (
        <div className="relative h-44 w-full overflow-hidden bg-muted flex-shrink-0">
          <Image
            src={article.image!}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      {/* Text content */}
      <div className="flex flex-col gap-2 p-3">
        <PublicationBadge name={article.publication} />
        <p className="font-semibold text-sm text-foreground leading-snug">
          {article.title}
        </p>
        {isPlaceholder ? (
          <span className="text-xs text-muted-foreground/50 italic">
            Link coming soon
          </span>
        ) : (
          <span
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "self-start px-0 text-ring text-xs font-medium pointer-events-none"
            )}
          >
            Read Article{" "}
            <Icons.externalLink className="ml-1.5 h-3 w-3" />
          </span>
        )}
      </div>
    </>
  );

  if (isPlaceholder) {
    return <div className={cardClasses}>{inner}</div>;
  }

  return (
    <Link
      href={article.url}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer nofollow" : undefined}
      className={cardClasses}
    >
      {inner}
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function WritingPage() {
  // Group non-featured articles by category
  const nonFeatured = writingArticles.filter((a) => !a.featured && !a.hidden);
  const byCategory = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: categoryLabels[cat],
    articles: nonFeatured.filter((a) => a.category === cat),
  })).filter((g) => g.articles.length > 0);

  return (
    <PageContainer
      title="Writing"
      description="Published across multiple niches — cybersecurity, music, health, and more. Content written for leading publications and independent clients."
    >
      <SectionNav
        sections={[
          { id: "featured", label: "Featured" },
          { id: "results", label: "Results" },
          ...byCategory.map((g) => ({ id: g.category, label: g.label })),
        ]}
      />
      {/* ── Featured Publications ────────────────────────────────────────── */}
      <AnimatedSection direction="up" className="mb-12" id="featured">
        <h2 className="font-heading text-xl font-semibold mb-1 text-foreground">
          Featured
        </h2>
        <p className="text-sm text-muted-foreground mb-5">
          A few of the publications that have featured my writing.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {featuredPublications.map((pub) => (
            <FeaturedPublicationCard
              key={pub.id}
              pub={pub}
              logoToken={process.env.NEXT_PUBLIC_LOGODEV_TOKEN}
            />
          ))}
        </div>
      </AnimatedSection>

      {/* ── Content Results ────────────────────────────────────────────── */}
      <AnimatedSection direction="up" delay={0.1} className="mb-12" id="results">
        <h2 className="font-heading text-xl font-semibold mb-1 text-foreground">
          Content That Converts
        </h2>
        <p className="text-sm text-muted-foreground mb-5">
          Conversion rate improvements from content rewrites and CRO work
          for Tailend Media — averaging a{" "}
          <span className="font-semibold text-foreground">~50% lift</span>{" "}
          in affiliate conversion rates.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <Image
              src="/writing/images/CRO1.jpg"
              alt="Conversion rate improvement: 4.39% to 6.62% after content rewrite"
              width={960}
              height={540}
              className="w-full h-auto"
            />
            <p className="px-4 py-3 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">
                4.39% → 6.62%
              </span>{" "}
              — 51% conversion lift after rewrite &amp; CRO
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <Image
              src="/writing/images/CRO2.jpg"
              alt="Conversion rate improvement: 4.56% to 7.08% after content rewrite"
              width={960}
              height={540}
              className="w-full h-auto"
            />
            <p className="px-4 py-3 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">
                4.56% → 7.08%
              </span>{" "}
              — 55% conversion lift after rewrite &amp; CRO
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* ── Category Sections ────────────────────────────────────────────── */}
      {byCategory.map(({ category, label, articles }, i) => (
        <AnimatedSection
          key={category}
          direction="up"
          delay={0.06 * (i + 2)}
          className="mb-10"
          id={category}
        >
          <h2 className="font-heading text-xl font-semibold mb-4 text-foreground">
            {label}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </AnimatedSection>
      ))}
    </PageContainer>
  );
}
