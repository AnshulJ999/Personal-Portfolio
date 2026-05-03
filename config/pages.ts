import { ValidPages } from "./constants"

type PagesConfig = {
  [key in ValidPages]: {
    title: string
    description: string
    metadata: {
      title: string
      description: string
    }
    bio?: string[]
  }
}

export const pagesConfig: PagesConfig = {
  home: {
    title: "Home",
    description: "Your tagline here.",
    metadata: {
      title: "Your Name - Your Title",
      description: "A brief description of who you are.",
    },
  },
  skills: {
    title: "Skills & Expertise",
    description: "Your skills summary.",
    metadata: {
      title: "Skills & Expertise",
      description: "Skills and expertise of Your Name.",
    },
  },
  projects: {
    title: "Projects",
    description: "A selection of my work.",
    metadata: {
      title: "Projects",
      description: "Projects by Your Name.",
    },
  },
  experience: {
    title: "Experience",
    description: "My professional journey.",
    metadata: {
      title: "Experience",
      description: "Professional experience of Your Name.",
    },
    bio: [
      "A short paragraph about your professional background.",
      "Add more paragraphs as needed.",
    ],
  },
  writing: {
    title: "Writing",
    description: "Articles and publications.",
    metadata: {
      title: "Writing",
      description: "Articles and publications by Your Name.",
    },
  },
  blog: {
    title: "Blog",
    description: "Thoughts and tutorials.",
    metadata: {
      title: "Blog",
      description: "Blog by Your Name.",
    },
  },
  music: {
    title: "Music",
    description: "My music work.",
    metadata: {
      title: "Music",
      description: "Music by Your Name.",
    },
  },
  testimonials: {
    title: "Testimonials",
    description: "What clients and collaborators say.",
    metadata: {
      title: "Testimonials",
      description: "Testimonials for Your Name.",
    },
  },
  contact: {
    title: "Contact",
    description: "Get in touch.",
    metadata: {
      title: "Contact",
      description: "Contact Your Name.",
    },
  },
  contributions: {
    title: "Open Source Contributions",
    description: "My open source work.",
    metadata: {
      title: "Open Source",
      description: "Open source contributions by Your Name.",
    },
  },
}
