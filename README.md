# Personal Portfolio

A feature-rich personal portfolio built with **Next.js 16**, **TypeScript**, and **Tailwind CSS**. Forked from [Naman Barkiya's portfolio template](https://github.com/namanbarkiya/minimal-next-portfolio) and extended with an MDX blog, a visitor notification system, a waveform audio player, and various UX improvements.

> **Live site:** [anshuljain.net](https://www.anshuljain.net)

---

## What's inside

### 7 built-in themes
Light, Dark, Retro, Cyberpunk, Paper, Aurora, and Synthwave — each defined as a CSS custom property block. Switch live from the navbar. Adding a new theme is a single block in `app/globals.css`.

### MDX blog
Drop `.md` or `.mdx` files into `content/posts/` and they're live. Features reading time, a 3-tier responsive Table of Contents, share buttons (Copy Link, X, LinkedIn), and structured data (JSON-LD) for Google rich results. No external CMS.

### Visitor notification system
Edge Middleware (`proxy.ts`) intercepts every request, filters bots using 55+ UA patterns and scanner path detection, then fires a push notification to [ntfy.sh](https://ntfy.sh). Real visitors are gated behind a client-side JS verification step to separate humans from bots — so your phone only buzzes for real people.

### 3-tier responsive Section Navigator
A custom ToC component that adapts to viewport width: dot nav on mobile, animated line nav at mid-widths, and a full persistent sidebar at wide screens. Used across 7 pages.

### Waveform audio player
A music page with a custom waveform visualizer (peaks pre-generated at build time via `scripts/generate-music-peaks.mjs`). Supports streaming playback, per-track metadata, and an optional download flag.

### Content-as-config
All site content lives in the `config/` directory as TypeScript objects — no CMS, no database. Reordering, hiding, or adding content is a one-line edit.

### Contact form via Google Forms
A contact form that bridges to a hidden Google Form — no backend or email service required. Data lands directly in a Google Sheet.

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
| Notifications | ntfy.sh (Edge Middleware) |
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

The `proxy.ts` Edge Middleware can send you a push notification whenever a real visitor lands on your site. It requires a free [ntfy.sh](https://ntfy.sh) account and two env vars (`NTFY_TOPIC`, `NTFY_BOT_TOPIC`). If those vars aren't set, the middleware runs silently without notifying — it won't break anything.

---

## Credits

- Base template by [Naman Barkiya](https://github.com/namanbarkiya/minimal-next-portfolio)
- UI components via [shadcn/ui](https://ui.shadcn.com)
- Icons via [Lucide](https://lucide.dev) and [React Icons](https://react-icons.github.io/react-icons/)
- Fonts: [Inter](https://fonts.google.com/specimen/Inter), [EB Garamond](https://fonts.google.com/specimen/EB+Garamond), [Norican](https://fonts.google.com/specimen/Norican), [CalSans](https://github.com/calcom/font)

---

## License

MIT
