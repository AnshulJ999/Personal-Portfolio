---
title: "Getting Started with This Portfolio Template"
date: "2024-01-01"
description: "A quick guide to customising the template and adding your first blog post."
tags: ["guide", "meta"]
---

Welcome! This is an example blog post included with the template to demonstrate how the MDX blog system works.

## Adding a post

Drop a `.md` or `.mdx` file into `content/posts/` with the frontmatter shown above.

**Required:** `title`, `date`, `description`
**Optional:** `tags[]`, `coverImage`

## Filling in your content

All site content lives in the `config/` directory — no CMS needed.

| File | What it controls |
|---|---|
| `config/site.ts` | Your name, URL, social links |
| `config/experience.ts` | Work history |
| `config/projects.ts` | Projects |
| `config/skills.ts` | Skills |
| `config/testimonials.ts` | Testimonials |
| `config/writing.ts` | Articles & publications |

## Themes

The site ships with 7 built-in themes you can toggle from the navbar:
**Light · Dark · Retro · Cyberpunk · Paper · Aurora · Synthwave**

Each theme is defined as a CSS custom property block in `app/globals.css`.
