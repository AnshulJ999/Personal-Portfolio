// ValidSkills is intentionally open — any string is valid.
// No tech-stack restrictions. Skills can be tools, competencies, or any phrase.
export type ValidSkills = string;

export type ValidCategory =
  | "AI Automation"
  | "Content Writing"
  | "SEO"
  | "Music"
  | "Full Stack"
  | "Frontend"
  | "Backend"
  | "UI/UX"
  | "Web Dev"
  | "Mobile Dev"
  | "Open Source"
  | "Audio / DSP";

export type ValidExpType = "Personal" | "Professional";

export type ValidPages =
  | "home"
  | "skills"
  | "projects"
  | "experience"
  | "contact"
  | "contributions"
  | "resume";
