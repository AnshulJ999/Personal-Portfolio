import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Anshul Jain | AI Automation Specialist",
    short_name: "Anshul Jain",
    description:
      "Anshul Jain — AI Automation Specialist designing AI-driven workflows for content operations, research, and business processes. Top Rated Plus on Upwork.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F4F2",
    theme_color: "#C9A96E",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "64x64",
        type: "image/x-icon",
      },
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: [
      "portfolio",
      "ai",
      "ai automation",
      "freelancer",
      "content writing",
    ],
    lang: "en",
    dir: "ltr",
    scope: "/",
  };
}

