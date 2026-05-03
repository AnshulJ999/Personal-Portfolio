export interface WritingArticle {
  id: string;
  title: string;
  publication?: string;
  category: "ai-tech" | "music" | "health-sleep" | "solar" | "business" | "crypto" | "other";
  url: string;
  image?: string;
  date?: string;
  featured?: boolean;
  hidden?: boolean; // hides from the page without deleting the entry
}

// ── Edit your articles here ───────────────────────────────────────────────────
// Set featured: true for the articles you're most proud of (shown in large cards at top)
// Category options: "ai-tech" | "music" | "health-sleep" | "solar" | "business" | "crypto" | "other"
// Leave publication undefined/omitted when the original publication is unknown
// image: use Wix CDN URL (static.wixstatic.com) or a local /writing/articles/ path

// Shared CDN base — strip Wix's resize params for full quality
const WIX = "https://static.wixstatic.com/media";

export const writingArticles: WritingArticle[]

export const categoryLabels: Record<WritingArticle["category"], string> = {
  "ai-tech": "AI & Technology",
  "music": "Music & Guitars",
  "health-sleep": "Health & Sleep",
  "solar": "Solar Energy",
  "business": "Business",
  "crypto": "Cryptocurrency & DeFi",
  "other": "Other",
};

export const featuredArticles = writingArticles.filter((a) => a.featured);

// ── Featured publications (shown on writing page + homepage list) ──────────────
// To add a new publication: append an entry here. Homepage list auto-adds the row;
// for the /writing page full card, also add an image path when you have one.
export interface FeaturedPublication {
  id: string;
  name: string;
  niche: string;
  url: string;
  image?: string; // used for the full card on /writing; optional until you have a banner
  domain: string;
  logoSrc?: string; // optional manual override for homepage / writing-page logo mark
}

export const featuredPublications: FeaturedPublication[]
