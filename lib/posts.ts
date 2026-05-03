import fs from "fs";
import path from "path";

// gray-matter and next-mdx-remote are required:
// npm install gray-matter next-mdx-remote
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/posts");

// ─── Heading extraction for blog ToC ─────────────────────────────────────────

export interface PostHeading {
  id: string
  text: string
  level: 2 | 3
}

/** Convert heading text to a URL-safe slug */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

/** Extract h2/h3 headings from raw markdown content */
export function getHeadingsFromContent(content: string): PostHeading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const headings: PostHeading[] = []
  let match: RegExpExecArray | null

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length as 2 | 3
    const text = match[2].trim()
    headings.push({ id: slugify(text), text, level })
  }

  return headings
}

// ─── Reading time ────────────────────────────────────────────────────────────

export function estimateReadingTime(content: string): number {
  const WORDS_PER_MINUTE = 230

  // Code blocks are scanned, not read line-by-line — 30s per block
  const codeBlocks = content.match(/```[\s\S]*?```/g) ?? []
  const codeSeconds = codeBlocks.length * 30

  const stripped = content
    .replace(/```[\s\S]*?```/g, "")           // remove fenced code blocks
    .replace(/`[^`\n]+`/g, "")                // remove inline code
    .replace(/!\[.*?\]\(.*?\)/g, "")          // remove images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")  // links → keep label text only
    .replace(/#{1,6}\s+/g, "")               // remove heading markers
    .replace(/[*_~>`|]/g, "")                // remove formatting characters
    .replace(/^\s*[-+*]\s+/gm, "")           // remove unordered list markers
    .replace(/^\s*\d+\.\s+/gm, "")           // remove ordered list markers
    .replace(/\s+/g, " ")                    // normalize whitespace
    .trim()

  const words = stripped.length > 0 ? stripped.split(" ").length : 0
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE + codeSeconds / 60))
}

// ─── Post data ───────────────────────────────────────────────────────────────

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags?: string[];
  coverImage?: string;      // optional: /blog/<slug>/cover.jpg
  hideCoverImage?: boolean; // hides cover image on post page; OG/JSON-LD still uses it
  readingTime?: number;     // minutes; auto-computed if not set in frontmatter
  featured?: boolean;
  tocLabels?: Record<string, string>; // slug → short label for gutter ToC display
}

export interface Post extends PostMeta {
  content: string;
}

function ensureDir(): boolean {
  return fs.existsSync(postsDirectory);
}

export function getPostSlugs(): string[] {
  if (!ensureDir()) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((file) => file.replace(/\.mdx?$/, ""));
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const mdxPath = path.join(postsDirectory, `${slug}.mdx`);
    const mdPath = path.join(postsDirectory, `${slug}.md`);
    const filePath = fs.existsSync(mdxPath)
      ? mdxPath
      : fs.existsSync(mdPath)
        ? mdPath
        : null;

    if (!filePath) return null;

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title ?? "Untitled",
      date: data.date ? String(data.date) : "",
      description: data.description ?? "",
      tags: data.tags ?? [],
      coverImage: data.coverImage ?? null,
      hideCoverImage: data.hideCoverImage ?? false,
      readingTime: data.readingTime ?? estimateReadingTime(content),
      featured: data.featured ?? false,
      tocLabels: data.tocLabels ?? {},
      content,
    };
  } catch {
    return null;
  }
}

export function getAllPosts(): PostMeta[] {
  return getPostSlugs()
    .map((slug) => {
      const post = getPostBySlug(slug);
      if (!post) return null;
      const { content: _content, ...meta } = post;
      return meta;
    })
    .filter((post): post is PostMeta => post !== null)
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}
