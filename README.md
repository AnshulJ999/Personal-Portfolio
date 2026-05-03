# Personal Portfolio

A personal portfolio and blog built with **Next.js 16**, **TypeScript**, and **Tailwind CSS**.

Forked from [Naman Barkiya's minimal-next-portfolio](https://github.com/namanbarkiya/minimal-next-portfolio), which provided the content-as-config pattern, 7 themes, and the core pages (home, experience, projects, skills, contact). Everything below was built on top of that foundation.

> **Live site:** [anshuljain.net](https://www.anshuljain.net)

---

## What was added

### Full MDX blog
A custom MDX pipeline with: reading time estimation, a 3-tier responsive Table of Contents, share buttons (Copy Link, X, LinkedIn), `ZoomableImage`, Giscus comments, and JSON-LD structured data for Google rich results.

### Visitor notification system
`proxy.ts` (Next.js 16 Edge Proxy) intercepts every request, filters bots using 55+ UA patterns, scanner path detection, and `sec-ch-ua` spoofing detection, then fires a push notification to [ntfy.sh](https://ntfy.sh). Real visitors are gated behind a client-side JS verification step — so your phone only buzzes for humans.

### 3-tier responsive Section Navigator
A custom ToC component that adapts to viewport width: dot nav on mobile, an animated line nav with cross-fade labels at mid-widths, and a full persistent sidebar at wide screens. Used across the site and on blogs for easier navigation and discovery.

### Music page with waveform audio player
A fully custom `/music` page: YouTube video grid (fetched via RSS with ISR), and an audio player with a waveform visualizer. Waveform peaks are pre-generated at build time via `scripts/generate-music-peaks.mjs` to avoid runtime cost. Includes embeds from Spotify and Bandcamp.

### Writing portfolio page
A `/writing` page showcasing articles and publications, with category filters, featured publication cards, and a "Content That Converts" section with before/after conversion rate graphs.

### Testimonials page
A `/testimonials` page with `sort`, `featured`, and `hidden` flags — featured testimonials surface on the homepage, hidden ones are accessible directly.

### Projects system
Featured projects are displayed as full-width case study cards — looping video or cover image on one side, description, tech stack, metrics row, and a collapsible "About" accordion on the other. Project detail pages (`/projects/[id]`) extend this with a screenshot gallery (zoom-enabled), full video demos with playback controls, expandable descriptions, and prev/next navigation between projects.

### Experience detail pages
Individual experience pages (`/experience/[id]`) with a full timeline, recommendation letter viewer (with document zoom modal), and bio paragraphs.

### Additional infrastructure
- Google Forms contact bridge (no backend or email service needed)
- Vercel `.vercel.app` → `www` redirect (prevents duplicate notifications)
- OG image, PWA manifest, XML sitemap, HTML site map page
- Multiple analytics layers: Vercel Analytics, Umami, Microsoft Clarity

---

## What comes from Naman's base template

- **Content-as-config** — all content as TypeScript objects in `config/`, no CMS
- **7 themes** — Light, Dark, Retro, Cyberpunk, Paper, Aurora, Synthwave
- **Core pages** — home, experience timeline, skills, contact form structure
- **shadcn/ui component library**, Framer Motion animations, `next-themes`

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 + CSS custom properties |
| UI Components | shadcn/ui (Radix UI primitives) |
| Animation | Framer Motion |
| Blog | next-mdx-remote (RSC) |
| Themes | next-themes |
| State | Zustand (single modal store) |
| Analytics | Vercel Analytics + Umami + Microsoft Clarity |
| Notifications | ntfy.sh (Next.js 16 Edge Proxy) |
| Hosting | Vercel |

---

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/AnshulJ999/Personal-Portfolio.git
cd Personal-Portfolio
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in your values — see `.env.example` for all variables and what they do.

### 3. Fill in your content

Edit the files in `config/`:

| File | What to change |
|---|---|
| `config/site.ts` | Your name, URL, social links |
| `config/experience.ts` | Work history |
| `config/projects.ts` | Projects |
| `config/skills.ts` | Skills |
| `config/testimonials.ts` | Testimonials |
| `config/writing.ts` | Articles & publications |
| `config/pages.ts` | Page titles, descriptions, bio text |

### 4. Add your assets

Place your images and media in `public/` — see `public/README.md` for the recommended structure.

### 5. Run locally

```bash
npm run dev
```

### 6. Deploy

Push to GitHub and connect to [Vercel](https://vercel.com). Set your environment variables in the Vercel dashboard.

---

## Visitor notifications (optional)

`proxy.ts` can push a notification to your phone whenever a real visitor lands on your site. Requires a free [ntfy.sh](https://ntfy.sh) account and two env vars (`NTFY_TOPIC`, `NTFY_BOT_TOPIC`). If those vars aren't set, the proxy runs silently — it won't break anything.

---

## Credits

- Base template by [Naman Barkiya](https://github.com/namanbarkiya/minimal-next-portfolio) ❤️
- UI components via [shadcn/ui](https://ui.shadcn.com)
- Icons via [Lucide](https://lucide.dev) and [React Icons](https://react-icons.github.io/react-icons/)
- Fonts: [Inter](https://fonts.google.com/specimen/Inter), [EB Garamond](https://fonts.google.com/specimen/EB+Garamond), [Norican](https://fonts.google.com/specimen/Norican), [CalSans](https://github.com/calcom/font)

---

## License

MIT
