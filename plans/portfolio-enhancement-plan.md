# Portfolio Enhancement Plan

## Mission

Make shafayet.dev feel like a premium engineering command center: recognizably inspired by VS Code, but elevated into a memorable portfolio experience that proves technical leadership, architecture judgment, DevOps maturity, execution clarity, and product engineering depth.

The VS Code shell stays. The improvement direction is not to replace it with a generic landing page, but to make every panel, tab, command, transition, and content view feel like part of a senior engineer's working environment.

## Positioning System

- Primary audience: hiring leaders and respected engineering peers.
- Secondary audience: collaborators or clients who value senior technical judgment.
- Core identity: Engineering Leader, Full Stack Architect, and DevOps Specialist.
- Core promise: helping teams design reliable systems, simplify complex architecture, and ship production software with clarity.
- Anti-goal: do not make the site feel mainly like a junior skill list, web-app builder showcase, or decorative VS Code imitation.

## Product Principles

1. Keep the editor metaphor useful.
   The shell should help visitors navigate, scan, and understand the work. It should not be decoration only.

2. Lead with applied judgment.
   Each major page should answer: what problem was clarified, what tradeoffs mattered, what technical direction was chosen, and what became easier for the team or product.

3. Make the first visit memorable.
   The home page should feel like entering a crafted engineering workspace, with premium restraint, useful density, and details that reward attention without slowing the visitor down.

4. Frame skills as capabilities.
   Tools and frameworks should support a larger story about leadership, architecture, delivery reliability, and product engineering.

5. Keep content editable.
   Sanity should own project, blog, profile, and site content. Code should provide presentation systems, not hard-coded portfolio claims, except for durable positioning fallbacks.

6. Preserve performance and accessibility.
   Motion should be purposeful, keyboard navigation should work, content should remain readable across all themes, and the site should build cleanly.

## Experience Architecture

### Global VS Code Shell

- Route-aware Explorer, tabs, and bottom bar.
- Global command palette opened from keyboard and shell controls.
- Active file naming that matches page context, including dynamic case-study tabs.
- Theme-aware surfaces using the existing CSS variable system.
- Mobile shell behavior that keeps navigation usable without feeling like a squeezed desktop.

### Home Page

- Hero becomes an engineering command center, not a generic product-builder intro.
- Left side stays breathable: name, senior positioning, short credibility statement, minimal CTAs.
- Right side becomes an Architecture Brief panel that communicates leadership, systems thinking, DevOps reliability, team execution, and product engineering.
- Add a Capability Matrix immediately after the hero.
- Use "Selected Case Studies", "Operating Principles", and "Engineering Notes" language instead of "Selected builds" and "Fresh from the workspace".

### Capability Matrix

- Add a smart homepage skills section titled `capability.matrix`.
- Organize skills as applied senior capabilities:
  - Technical Leadership: team direction, delivery planning, code review culture, execution clarity.
  - System Architecture: service boundaries, data modeling, scalability, maintainability, tradeoff decisions.
  - DevOps & Reliability: CI/CD, deployment strategy, infrastructure thinking, monitoring, release confidence.
  - Product Engineering: full stack delivery, frontend systems, CMS architecture, UX-minded implementation.
- Include restrained `Uses:` lines for tools like Next.js, React, TypeScript, Node.js, Sanity, CI/CD, and cloud platforms.
- Avoid long logo walls, noisy badge clouds, and generic "skills" sections.

### Projects

- Projects index should feel like a curated engineering workbench, not a plain card grid.
- Reframe projects as case studies.
- Each project should expose problem, role, architecture decisions, constraints, delivery approach, outcome, demo, and source when available.
- Filtering can come later only if there is enough project volume to justify it.

### Project Case Studies

- Each project page should read like a polished engineering case study.
- Required narrative sections:
  - Problem
  - Role
  - Constraints
  - Approach
  - System/design decisions
  - Outcome
  - Links and evidence
- Visual direction: command output, file metadata, terminal diagnostics, and structured proof panels.
- Sanity should provide optional richer fields while the frontend has graceful fallbacks.

### About

- Reframe as a leadership profile, not only a biography or tool summary.
- Emphasize engineering judgment, team collaboration, architecture thinking, delivery principles, and operating style.
- Avoid generic personality copy; use concrete signals and examples.

### Blog

- Treat posts as technical field notes, architecture reflections, DevOps lessons, and leadership thinking.
- Improve scanability with topic, date, excerpt, and reading flow.
- Keep Portable Text rendering clean and theme-aware.

### Contact

- Make contact feel like opening a useful handoff file.
- Position conversations around leadership roles, architecture consulting, DevOps maturity, and senior engineering collaboration.
- Include availability, preferred work, response expectations, and social links.

### GitHub

- Turn it into a credibility surface rather than a list of links.
- Add a GitHub Activity Matrix on `/github`, not the homepage.
- Show engineering consistency, technical range, repository signals, and open-source habits without distracting from homepage positioning.
- If contribution-calendar data is unavailable from the REST API, use a premium repo/activity matrix based on available repository metadata first.

### GitHub Activity Matrix

- Add a section titled `github.activity`.
- Include a GitHub-style daywise contribution matrix for the last 12 months.
- Use GitHub GraphQL contribution data when `GITHUB_TOKEN` is available, with a public repository update-day fallback when it is not.
- Include aggregated private repository stats when the token has access; never list private repository names.
- Include repository signal board:
  - recently updated repositories
  - top languages
  - stars and forks where available
  - repository descriptions and links
- Include engineering habit signals:
  - maintenance
  - experimentation
  - documentation
  - automation
  - open-source learning

### Settings

- Keep theme switching as a real feature.
- Make themes feel like workspace profiles.
- Ensure theme changes affect shell status and all page surfaces.

### About Stack Lock

- `stack.lock` should show skill icons, not plain text-only chips.
- Icons should support fast recognition while keeping the section compact and editor-native.
- Unknown skills should fall back to a generic code icon.

## Sanity Content Model Direction

- Keep project content structured around reusable proof fields, not page-specific decoration.
- Project schema should support:
  - role
  - problem
  - approach
  - outcome
  - highlights
  - process steps
  - rich body content
  - demo/source URLs
  - image alt text
- Site settings should stay focused on global identity and primary copy.
- Blog content should remain Portable Text-first with clear metadata.
- No Sanity schema change is required for the first repositioning pass.

## Visual Direction

- Editor-inspired, not editor-limited.
- Premium, restrained, and technical rather than flashy or generic.
- Use sharp panels, mono labels, layered editor surfaces, useful metadata, and theme-aware contrast.
- Avoid one-note blue/purple gradients.
- Prefer real content, architecture briefs, leadership notes, activity matrices, terminal states, and structured proof panels over abstract decoration.
- Cards should be used for actual repeated objects and framed tools, not every section.

## Motion Direction

- Use Motion for entry transitions, route-level polish, and interactive panels.
- Keep animation short and purposeful.
- Respect readability and avoid constant ambient movement.
- Use hover and focus states to make the shell feel responsive.

## Implementation Passes

### Pass 1: Global Shell Foundation

- Route-aware Explorer.
- Route-aware tabs.
- Route-aware bottom bar.
- Global command palette.
- Theme sync between settings and shell.

Status: implemented.

### Pass 2: Project Case Study Premium Pass

- Upgrade project detail pages into memorable case-study documents.
- Add stronger hero composition and metadata panels.
- Improve proof blocks, process timeline, and long-form notes.
- Keep Sanity fallbacks for incomplete content.

Status: implemented.

### Pass 3: Projects Index Workbench

- Redesign project listing as a curated work surface.
- Improve empty states and project metadata.
- Add a stronger featured/flagship project treatment.

Status: implemented.

### Pass 4: About and Contact Repositioning

- Rewrite and redesign about/contact as conversion-focused portfolio pages.
- Make collaboration style and availability obvious.
- Keep all copy editable where appropriate.

Status: implemented.

### Pass 5: Blog Reading System

- Improve article cards and post reading layout.
- Add stronger Portable Text typography.
- Make technical writing feel native to the developer OS concept.

Status: implemented.

### Pass 6: Leadership Homepage Repositioning

- Replace homepage hero fallbacks with leadership and architecture positioning.
- Replace right-side hero card with the Architecture Brief panel.
- Add Capability Matrix below the hero.
- Keep CTAs minimal and visually quieter.
- Reframe homepage vocabulary around case studies, operating principles, and engineering notes.

Status: current.

### Pass 7: GitHub Credibility Workspace

- Redesign `/github` as a premium credibility surface.
- Add GitHub Activity Matrix.
- Add repository signal board and engineering habit signals.
- Keep fetch fallback states polished and calm.

Status: current.

### Pass 8: Motion, Responsiveness, and Polish

- Audit mobile, tablet, and desktop layouts.
- Tighten spacing, text fit, and interaction states.
- Add reduced-motion consideration where needed.

### Pass 9: SEO, AEO, and Sharing

- Improve metadata and Open Graph.
- Add structured data where it makes sense.
- Ensure project and blog pages are strong search/share surfaces.

### Pass 10: Performance and QA

- Verify build, typecheck, lint.
- Check Core Web Vitals-sensitive choices.
- Review image sizing, font loading, and bundle impact.

## Verification Checklist

- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- Smoke check important routes:
  - `/`
  - `/github`
  - `/projects`
  - `/projects/[slug]`
  - `/about`
  - `/blog`
  - `/contact`
  - `/settings`

## Current Priority

Implement Pass 6 and Pass 7: leadership homepage repositioning, Capability Matrix, and GitHub Activity Matrix.
