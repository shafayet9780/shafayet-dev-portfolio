# Dependency Upgrade Plan

## Context

Portfolio uses outdated deps: React 19 RC (not stable), Next.js 15, Sanity v3, Tailwind v3. Package-lock.json deleted, no lock file exists. User wants aggressive upgrade to latest everything, switching to pnpm.

## Current Project State

| Item | Value |
|------|-------|
| Package manager | npm (lock file deleted) → **pnpm** |
| Node.js | v22.17.1 (meets all requirements) |
| Next.js | 15.0.3 |
| React | 19.0.0-rc-66855b96-20241106 |
| @types/react | ^18 (**MISMATCH** with React 19) |
| Sanity | ^3.63.0 |
| Tailwind CSS | ^3.4.1 |
| TypeScript | ^5 |
| ESLint | ^8 |
| framer-motion | ^11.18.2 |
| Router | App Router |
| Sanity Studio | Embedded at `/studio` |

## Packages to Upgrade

| Package | Current | Target | Risk |
|---------|---------|--------|------|
| `next` | 15.0.3 | 16.2.6 | **HIGH** — Turbopack default, `next lint` removed, `eslint` config removed, async APIs enforced |
| `react` | 19.0.0-rc | 19.2.6 | Low — RC to stable |
| `react-dom` | 19.0.0-rc | 19.2.6 | Low |
| `sanity` | ^3.63.0 | 5.24.0 | Medium — v3→v4 (Node 20+), v4→v5 (React 19.2+). No API changes |
| `@sanity/client` | ^6.22.4 | 7.22.0 | Medium — major version |
| `@sanity/icons` | ^3.4.0 | 3.7.4 | Low — minor |
| `@sanity/image-url` | ^1.1.0 | 2.1.1 | Medium — major version |
| `@sanity/vision` | ^3.63.0 | 5.24.0 | Low — follows sanity core |
| `next-sanity` | ^9.8.10 | 12.4.5 | **HIGH** — major jump, needed for Next 16 compat |
| `tailwindcss` | ^3.4.1 | 4.3.0 | **HIGH** — config rewrite, class renames, PostCSS change |
| `framer-motion` | ^11.18.2 | _(remove)_ | Replace with `motion` 12.38.0 |
| `styled-components` | ^6.1.13 | 6.4.1 | Low — not imported anywhere (Sanity peer dep) |
| `@portabletext/react` | ^3.1.0 | 6.2.0 | Medium — major |
| `react-icons` | ^5.3.0 | 5.6.0 | Low — minor |
| `@types/react` | ^18 | 19.2.14 | **Critical fix** — must match React 19 |
| `@types/react-dom` | ^18 | 19.2.3 | **Critical fix** |
| `@types/node` | ^20 | 22 | Low |
| `typescript` | ^5 | 6.0.3 | Medium — major |
| `eslint` | ^8 | 10.3.0 | **HIGH** — flat config required |
| `eslint-config-next` | 15.0.3 | 16.2.6 | Follows Next.js |
| `postcss` | ^8 | 8.5.14 | Low — minor |
| `@sanity/cli` | ^3.63.0 | 6.5.1 | Low — follows sanity core |

## Required Code/Config Changes

### 1. `next.config.ts`
- Remove `eslint: { ignoreDuringBuilds: true }` — option removed in v16
- No webpack config → Turbopack works as default

### 2. `.eslintrc.json` → `eslint.config.mjs`
- Migrate to ESLint flat config format
- Use `@next/eslint-plugin-next` directly
- Update package.json `lint` script: `"lint": "eslint ."` (since `next lint` removed)

### 3. `postcss.config.mjs`
- Replace `tailwindcss: {}` with `"@tailwindcss/postcss": {}`
- Install `@tailwindcss/postcss` package

### 4. `app/globals.css`
- Replace `@tailwind base/components/utilities` with `@import "tailwindcss"`
- Reference old tailwind config: add `@config "../tailwind.config.ts"` OR migrate config to CSS `@theme` directives
- Remove CSS rules that duplicate Tailwind utilities (`.transition-all`, `.transition-transform`, `.transition-opacity`, `.transition-colors`)
- Remove `.backdrop-blur-sm` custom CSS (conflicts with Tailwind)
- Convert `.animate-cursor` and `.animate-loading-bar` to `@utility` blocks

### 5. `tailwind.config.ts`
- Will be referenced via `@config` in globals.css (v4 doesn't auto-detect)
- `darkMode: "class"` → needs to become `"selector"` (v4 change) or handle via CSS
- Custom `scrollbar-hide` plugin may need conversion to `@utility`
- `content` array no longer needed (v4 auto-detects)

### 6. Tailwind class renames across all `.tsx` files
- `bg-opacity-*` → slash syntax (e.g., `bg-black/50`) — **~6 instances**
- `flex-shrink-0` → `shrink-0` — **3 instances**
- `rounded-sm` → `rounded-xs` — **3 instances**
- `outline-none` → `outline-hidden` — **2 instances**
- `backdrop-blur-sm` → `backdrop-blur-xs` — **3 instances**
- Note: `npx @tailwindcss/upgrade` automates most of these

### 7. framer-motion → motion (3 files)
- `app/(main)/home-client.tsx`: change `from "framer-motion"` → `from "motion/react"`
- `app/components/Header.tsx`: same
- `app/components/layout/CommandPalette.tsx`: same

### 8. `package.json` scripts
- Remove `--turbopack` flags if any (Turbopack default in v16)
- Change `"lint": "next lint"` → `"lint": "eslint ."`

### 9. `app/layout.tsx`
- `scroll-smooth` class on `<html>` — may need `data-scroll-behavior="smooth"` attribute for v16 scroll behavior

### 10. `@sanity/image-url` v2
- `studio/lib/image.ts`: check if `createImageUrlBuilder` API changed
- May need import path update

### 11. `next-sanity` v12
- `studio/lib/client.ts`: verify `createClient` import still works
- `studio/lib/live.ts`: `defineLive` API may have changed
- `app/(studio)/studio/[[...tool]]/page.tsx`: `NextStudio`, `metadata`, `viewport` exports may differ

## Implementation Steps

### Phase 1: Initialize pnpm
```bash
pnpm init  # or just run pnpm install with existing package.json
```

### Phase 2: Core framework (React + Next.js + TypeScript)
```bash
pnpm add next@latest react@latest react-dom@latest
pnpm add -D typescript@latest @types/react@latest @types/react-dom@latest @types/node@latest
```

### Phase 3: Sanity ecosystem
```bash
pnpm add sanity@latest @sanity/client@latest @sanity/icons@latest @sanity/image-url@latest @sanity/vision@latest next-sanity@latest @portabletext/react@latest
pnpm add -D @sanity/cli@latest
```

### Phase 4: Tailwind CSS v4
```bash
pnpm remove tailwindcss
pnpm add -D tailwindcss@latest @tailwindcss/postcss
```
Then run automated upgrade tool:
```bash
pnpm dlx @tailwindcss/upgrade
```
Review and fix remaining class renames manually.

### Phase 5: Other dependencies
```bash
pnpm remove framer-motion
pnpm add motion@latest
pnpm add styled-components@latest react-icons@latest
pnpm add -D postcss@latest
```

### Phase 6: ESLint migration
```bash
pnpm remove eslint-config-next eslint
pnpm add -D eslint@latest @next/eslint-plugin-next@latest @eslint/js@latest
```
Create `eslint.config.mjs` with flat config.
Delete `.eslintrc.json`.
Update `package.json` lint script.

### Phase 7: Run Next.js codemod
```bash
pnpm dlx @next/codemod@canary upgrade latest
```

### Phase 8: Manual code changes
- Update framer-motion imports → `motion/react`
- Update next.config.ts (remove eslint config)
- Update globals.css for Tailwind v4
- Update postcss.config.mjs
- Fix Tailwind class renames missed by automation
- Update ESLint config
- Verify Sanity client/studio imports

## Validation Commands

```bash
# Install
pnpm install

# Type check (no script exists — run tsc directly)
pnpm tsc --noEmit

# Lint
pnpm lint     # after updating to "eslint ."

# Build
pnpm build

# Dev server smoke test
pnpm dev
# Then manually verify: homepage, /studio, /projects, /blog, /contact, theme switching
```

**Missing scripts** (optional to add):
- `"typecheck": "tsc --noEmit"` — no typecheck script exists
- No format check (no Prettier configured)
- No test script (no test framework)

## Risks and Manual Review Items

1. **next-sanity v12 API changes** — `defineLive`, `SanityLive`, `NextStudio` imports may have changed. `studio/lib/live.ts` uses experimental `vX` API version. Must verify after upgrade.

2. **@sanity/client v7 breaking changes** — `createClient` import source could differ. `ContactCode.tsx` creates its own client instance from `@sanity/client` directly (should use shared client).

3. **@portabletext/react v6** — major jump from v3. Serializer API may have changed. Check blog/post rendering.

4. **Tailwind v4 class renames** — automated tool handles ~90% but CSS-variable-based colors like `bg-[--accent-color] bg-opacity-30` need manual conversion to `bg-[--accent-color]/30` or similar.

5. **TypeScript 6** — verify no breaking type changes affect project. May need `tsconfig.json` updates.

6. **ESLint 10 flat config** — new format, may need plugins reconfigured. `next/core-web-vitals` and `next/typescript` presets may work differently.

7. **styled-components** — not imported anywhere in app code but listed as dependency. Likely Sanity Studio peer dep. Verify if still needed after Sanity v5, remove if not.

8. **`scroll-smooth` on `<html>`** — Next.js 16 no longer overrides `scroll-behavior`. May cause smooth-scroll during page navigation if not addressed.

9. **Build with Turbopack** — no custom webpack config in project (good), but verify third-party packages are Turbopack-compatible.
