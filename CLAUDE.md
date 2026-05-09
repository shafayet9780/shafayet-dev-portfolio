# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start dev server (localhost:3000)
- `npm run build` — production build
- `npm run lint` — ESLint (note: ESLint errors are ignored during builds via `next.config.ts`)

No test framework is configured.

## Architecture

VS Code-themed portfolio site built with Next.js 15 (App Router) + Sanity CMS + Tailwind CSS + Framer Motion.

### Route Groups

- `app/(main)/` — portfolio pages (home, about, blog, projects, contact, github, settings). Uses `layout.tsx` that fetches site settings from Sanity and wraps content in the VS Code chrome (Titlebar → ResponsiveLayout with Sidebar, Explorer, Tabsbar, Bottombar).
- `app/(studio)/` — Sanity Studio mounted at `/studio`. Separate layout group, no portfolio chrome.

### Server/Client Split

Pages in `(main)/` follow a pattern: server component page fetches Sanity data, passes it as props to a `*-client.tsx` client component (e.g., `page.tsx` → `home-client.tsx`). `ResponsiveLayout.tsx` is the main client component handling responsive sidebar/explorer toggling and scroll-based bottombar visibility.

### Theming

8 VS Code themes defined as CSS custom properties in `app/theme.css` (GitHub Dark default, Dracula, Nord, Night Owl, VS Light, Light Modern, VS Dark, Dark Modern). Theme stored in `localStorage`, applied via `data-theme` attribute on `<html>`. Flash prevention via inline script in root `layout.tsx`. All component colors reference CSS variables like `--main-bg`, `--text-color`, `--accent-color`.

### Sanity CMS

- Config: `sanity.config.ts` (basePath: `/studio`)
- Client: `studio/lib/client.ts` (uses `next-sanity`)
- Schemas: `studio/schemas/schemaTypes/` — siteSettings, project, post, author, category, social, blockContent
- Structure: `studio/structure.ts` — custom desk structure
- Environment: `lib/env.ts` — uses separate datasets for dev (`NEXT_PUBLIC_SANITY_DATASET_DEVELOPMENT`) and prod (`NEXT_PUBLIC_SANITY_DATASET_PRODUCTION`)

### Key Dependencies

- React 19 RC, Next.js 15, Sanity v3, Framer Motion, styled-components, react-icons
