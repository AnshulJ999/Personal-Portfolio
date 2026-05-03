import { ValidCategory, ValidExpType, ValidSkills } from "./constants";

// ── Types ──────────────────────────────────────────────────────────────────

export interface ProjectMetric {
  value: string; // e.g. "50%"
  label: string; // e.g. "Faster Drafts"
}

export interface ProjectVideo {
  type: "youtube" | "mp4";
  /** YouTube video ID or path to local MP4 (H.264 fallback) */
  src: string;
  /** AV1 version in MP4 container — served first to capable browsers */
  srcAv1?: string;
  /** Optional poster image shown before play */
  thumbnail?: string;
  /** Show playback controls (scrubber, pause, fullscreen). Default: false (GIF-like). */
  showControls?: boolean;
}

interface DescriptionDetails {
  paragraphs: string[];
  bullets: string[];
}

export interface ProjectInterface {
  id: string;
  type: ValidExpType;
  companyName: string;
  /** Short label for nav/ToC (falls back to companyName if omitted) */
  shortName?: string;
  category: ValidCategory[];
  shortDescription: string;

  // ── Display ───────────────────────────────────────────────────────────
  /**
   * true  → full-width Tier 1 "featured" case-study block
   * false → Tier 2 card in the 2-col grid
   */
  featured?: boolean;
  /** Show on homepage project grid. Default: true for featured projects. */
  showOnHomepage?: boolean;

  // ── Media ─────────────────────────────────────────────────────────────
  /** Static cover image (used as hero fallback in featured card right column) */
  coverImage?: string;
  /** Short silent looping mp4 used as Tier-2 cover (H.264 fallback) */
  shortClip?: string;
  /** AV1 version of the short clip — served first to capable browsers */
  shortClipAv1?: string;
  /** Main demo video */
  video?: ProjectVideo;
  /** Gallery strip screenshots */
  screenshots?: string[];

  // ── Key results ───────────────────────────────────────────────────────
  metrics?: ProjectMetric[];

  // ── Links ─────────────────────────────────────────────────────────────
  websiteLink?: string;
  githubLink?: string;

  // ── Role ──────────────────────────────────────────────────────────────
  /** Your role/title on the project (e.g. "AI Automations Specialist") */
  role?: string;

  // ── Core data ─────────────────────────────────────────────────────────
  techStack: ValidSkills[];
  startDate: Date;
  endDate: Date;
  companyLogoImg: string;
  descriptionDetails: DescriptionDetails;

  // ── Preview ─────────────────────────────────────────────────────────
  /**
   * Which paragraph indices to show in the collapsed preview on the
   * featured project card. Defaults to [0] (first paragraph).
   * e.g. [1, 2] shows the 2nd and 3rd paragraphs as the teaser.
   */
  previewParagraphs?: number[];
}

// ── Projects data ──────────────────────────────────────────────────────────

export const Projects: ProjectInterface[]

export const featuredProjects = Projects.filter((p) => p.featured);
export const homepageProjects = Projects.filter(
  (p) => p.featured && p.showOnHomepage !== false
);
export const regularProjects = Projects.filter((p) => !p.featured);
