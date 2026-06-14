# WIP: Commit 7 — Reading progress + micro-interactions (section 9)

## Task

Implementar la sección 9 del plan original (Mejoras de diseño y micro-interacciones), con dos apuntes del usuario:

- **9b — Page transitions:** usar el componente `<ViewTransition>` de React integrado por Next.js 16.2 (flag `experimental.viewTransition: true`), NO la API nativa del browser con feature-detect manual.
- **9d — Count-up de stats hero:** revisar si ya está implementado en `HeroStatsBlock`; si lo está, no rehacer.

### Subtareas

- **9a** — Reading progress bar en blog posts (sticky superior, thin, naranja `#FCA311`, se llena con scroll).
- **9b** — Page transitions con `<ViewTransition>` de React vía Next 16.2. Fade + slide-up sutil, 200-300ms. Bump previo de `next` a `16.2.6` en commit separado.
- **9c** — Hover states mejorados en cards (proyectos/artículos/charlas): glow naranja con `box-shadow`, border `border-white/5` → `border-[#FCA311]/30`, tag/chip principal con cambio de opacidad.
- **9d** — Revisar si ya hay count-up en stats hero (`HeroStatsBlock`). Si no, añadirlo (Intersection Observer + animación).
- **9e** — Scroll-to-top button en páginas largas (blog posts, sobre mí).

### Criterios de aceptación

- Reading progress funciona en todos los blog posts.
- Page transitions suaves, no bloqueantes (`<ViewTransition>` de React, fallback degradado automático en navegadores sin soporte gracias a Next).
- Cards con glow/border transition en hover.
- Stats del hero animadas al entrar viewport (verificar primero el estado actual).
- Scroll-to-top en páginas largas.
- Funciona en móvil; rendimiento OK (`will-change`, `passive` listeners).

## Phase

Done

## Log

- [2026-05-18 21:00] Phase started: Planning
- [2026-05-24 09:29] Agent: planner — read CLAUDE.md, package.json, next.config.mjs, components (cards, hero-stats, navigation-dock, featured-*), pages (blog/[slug], sobre-mi, layout), hooks/use-count-up, vitest config and existing tests
- [2026-05-24 09:29] Agent: planner — diagnostic complete: 9d already implemented (HeroStatsList + useCountUp with IntersectionObserver, reduced-motion guard, RAF + easeOutCubic); listing cards (blog/project/talk) already have orange glow + #fca311/30 border on hover; bento cards (featured-posts, featured-project, navigation-dock, hero-stats-block) still use only `hover:border-white/10`; next.config.mjs uses Next 16.0.10 with React Compiler enabled and no experimental flags
- [2026-05-24 09:29] Agent: planner — wrote PLAN-commit-7-micro-interactions.md and moved it to progress/
- [2026-05-24 10:45] Agent: planner — refinement requested by user: 9b should use React `<ViewTransition>` integrated by Next.js 16.2 (`experimental.viewTransition: true`), not native browser API with manual feature-detect
- [2026-05-24 10:45] Agent: planner — fetched official docs (https://nextjs.org/docs/app/guides/view-transitions.md and viewTransition.md, version 16.2.6); confirmed: flag is `experimental.viewTransition` (singular), import is `import { ViewTransition } from 'react'` (direct, no `unstable_` per official guide; fallback alias documented for typings), component works in Server Components (layout stays Server), Next handles fallback silently when browser unsupported, no `document.startViewTransition` call needed
- [2026-05-24 10:45] Agent: planner — checked next-intl@4.9.1 peerDeps: supports `next@^16.0.0` so 16.2.6 is compatible; reviewed Next 16.2 release notes (perf RSC, Turbopack fixes, scroll/focus rework with React Fragment refs, Server Function logging) — no obvious breakings for this repo, but flagged scroll/focus rework for manual smoke test post-bump
- [2026-05-24 10:45] Agent: planner — refined PLAN-commit-7-micro-interactions.md: added "Pre-requisito: bump de Next a 16.2.6" section recommending separate `chore(deps)` commit; rewrote architecture decision 2 (9b) to use `<ViewTransition>` directly in `app/[locale]/layout.tsx` Server Component (no client wrapper, no pathname detection); removed `RouteTransitionLayout` component and its test from Files to Create; updated next.config.mjs snippet with `experimental: { viewTransition: true }`; added CSS block with reduced-motion rule for `::view-transition-*` pseudo-elements per official docs; documented ASUMPTION about typings (`ViewTransition` direct vs `unstable_ViewTransition` alias) for manual verification; kept 9a, 9c, 9d, 9e sections unchanged
- [2026-05-24 11:00] Agent: fullstack-developer — started implementation of commit 7: bump next to 16.2.6, viewTransition flag, useScrollProgress hook, ReadingProgressBar, ScrollToTopButton, ViewTransition in layout, bento hover homogenization, globals.css view-transitions CSS, tests
- [2026-05-24 11:30] Agent: fullstack-developer — build fix: bumped @types/react ^19 → 19.2.15 (pin exact), @types/react-dom ^19 → 19.2.3; created types/react-canary.d.ts with single `/// <reference types="react/canary" />` line to expose ViewTransition from stable types; type-check: 0 errors; build: success (79 static pages); tests: 411 passed (56 files), all green
- [2026-06-14] Agent: code-reviewer — verdict FAIL-TESTS: only blocker was missing tests for ScrollToTopButton; production code clean against all standards
- [2026-06-14] Agent: test-writer — added tests/components/ui/scroll-to-top-button.test.tsx (7 tests), removed stray "use client" from use-scroll-progress.test.tsx; type-check 0, tests 418 passed (57 files)
- [2026-06-14] Smoke test (Next 16.2.6 bump, browser): reading progress bar scaleX 0→0.54→1.0; back-navigation scroll restoration restores scrollY=800 with focus on BODY (no weird jump); no console errors. Production build green.
- [2026-06-14] Committed in two: `chore(deps): bump next to 16.2.6...` (1c28ff4) + `feat(ui,blog): add reading progress, page transitions and micro-interactions` (5f191de). Plan + review moved to completed/. Phase → Done.
