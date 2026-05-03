import { ValidSkills } from "./constants";

export interface ExperienceInterface {
  id: string;
  sortOrder: number; // lower = higher on the page — edit this to reorder
  position: string;
  company: string;
  location: string;
  startDate: Date;
  endDate: Date | "Present";
  description: string[];
  achievements: string[];
  skills: ValidSkills[];
  companyUrl?: string;
  logo?: string;
  highlightStat?: string;
}

export const experiences: ExperienceInterface[]
