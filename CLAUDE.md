# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm dev` — start dev server (localhost:3000, Turbopack)
- `pnpm build` — production build (Turbopack)
- `pnpm lint` — ESLint (flat config, `eslint.config.mjs`)
- `pnpm typecheck` — TypeScript check (`tsc --noEmit`)

No test framework is configured.

## Architecture

VS Code-themed portfolio site built with Next.js 16 (App Router, Turbopack) + Sanity CMS v5 + Tailwind CSS v4 + Motion (formerly Framer Motion).

### Route Groups

- `app/(main)/` — portfolio pages (home, about, blog, projects, contact, github, settings). Uses `layout.tsx` that fetches site settings from Sanity and wraps content in the VS Code chrome (Titlebar → ResponsiveLayout with Sidebar, Explorer, Tabsbar, Bottombar).
- `app/(studio)/` — Sanity Studio mounted at `/studio`. Separate layout group, no portfolio chrome.

### Server/Client Split

Pages in `(main)/` follow a pattern: server component page fetches Sanity data, passes it as props to a `*-client.tsx` client component (e.g., `page.tsx` → `home-client.tsx`). `ResponsiveLayout.tsx` is the main client component handling responsive sidebar/explorer toggling and scroll-based bottombar visibility.

### Theming

8 VS Code themes defined as CSS custom properties in `app/theme.css` (GitHub Dark default, Dracula, Nord, Night Owl, VS Light, Light Modern, VS Dark, Dark Modern). Theme stored in `localStorage`, applied via `data-theme` attribute on `<html>`. Flash prevention via inline script in root `layout.tsx`. All component colors reference CSS variables like `--main-bg`, `--text-color`, `--accent-color`.

### Tailwind CSS v4

Uses `@tailwindcss/postcss` plugin. Config referenced via `@config` directive in `app/globals.css`. Custom utilities (`scrollbar-hide`, `animate-cursor`, `animate-loading-bar`) defined with `@utility` blocks in globals.css.

### Sanity CMS

- Config: `sanity.config.ts` (basePath: `/studio`)
- Client: `studio/lib/client.ts` (uses `next-sanity`)
- Live: `studio/lib/live.ts` (uses `next-sanity/live` — `defineLive`)
- Schemas: `studio/schemas/schemaTypes/` — siteSettings, project, post, author, category, social, blockContent
- Structure: `studio/structure.ts` — custom desk structure
- Environment: `lib/env.ts` — uses separate datasets for dev (`NEXT_PUBLIC_SANITY_DATASET_DEVELOPMENT`) and prod (`NEXT_PUBLIC_SANITY_DATASET_PRODUCTION`)

### Key Dependencies

- React 19.2, Next.js 16, TypeScript 6, Sanity v5, Motion 12, styled-components 6, react-icons 5
