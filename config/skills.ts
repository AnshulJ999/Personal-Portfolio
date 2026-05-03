import { Icons } from "@/components/common/icons";

export interface skillsInterface {
  name: string;
  description: string;
  rating: number;
  /** Explicit display order (lower = first). Skills without sortOrder appear after sorted ones. */
  sortOrder?: number;
  icon: any;
}

// Skills are unrestricted — any tool, competency, or phrase is valid.
export const skillsUnsorted: skillsInterface[]

export const skills = skillsUnsorted
  .slice()
  .sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));

export const featuredSkills = skills.slice(0, 8);
