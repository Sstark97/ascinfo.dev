# WIP: Commit 5 — Testimonials section

## Task

Implementar la sección de testimonios siguiendo la arquitectura hexagonal del proyecto (entidad + repo abstracto + adaptadores MDX y Notion + use case + UI), y mostrarla en la home (después de los featured posts) y en la página "Sobre mí" (al final de la trayectoria, antes del Stack o del Contact CTA).

### Schema de la entidad Testimonial

```
author       : string         # nombre completo
role         : string         # ej. "Senior Software Engineer"
company      : string         # ej. "Lean Mind"
quote        : string         # texto del testimonio
locale       : "es" | "en"
linkedinUrl  : string         # https://linkedin.com/in/...
avatarUrl    : string | undefined  # ej. "/testimonials/jose-perez.jpg"
order        : number | undefined  # para orden manual
```

### Componentes UI

- `TestimonialCard` (Server Component): card con quote, autor/rol/empresa, avatar (next/image) o iniciales si no hay foto. Toda la card clickable abriendo `linkedinUrl` en `_blank` con `rel="noopener noreferrer"`. Hover state: `border-[#FCA311]/30` + shadow naranja.
- `TestimonialsSection`: wrapper con título "Lo que dicen de mí" / "What others say" + grid 2 cols (1 en mobile)

### Datos iniciales

2 MDX placeholder en `src/content/testimonials/`:
- `jose-perez.mdx` y `maria-garcia.mdx` con los textos del plan original (los dos testimonios reales del LinkedIn de Aitor)
- Frontmatter: author, role, company, quote, locale, linkedinUrl, avatarUrl (opcional), order (opcional)

### Wiring

- `Container.ts`: registrar el repo Testimonial según `CMS_PROVIDER`
- Home: añadir `<TestimonialsSection>` después de los featured posts (nueva fila col-span-12)
- Sobre mí: añadir `<TestimonialsSection>` al final, antes del Contact CTA (sección 8 del plan)

### Decisiones tomadas

- Arquitectura hexagonal completa (entity + repo + ambos adaptadores MDX y Notion)
- Solo placeholders en MDX por ahora; el usuario creará la database Notion cuando quiera
- Card clickable a LinkedIn (no a perfil interno del autor)
- Fallback a iniciales si no hay `avatarUrl`
- next/image NO se usa para imágenes externas; las fotos viven en `/public/testimonials/`
- Sin instalar dependencias nuevas
- i18n para los labels (título, "Ver perfil LinkedIn")

## Phase

Implementation (commit 5 — sub-tasks complete, pending final visual verification and commit)

## Log

- [2026-05-15 16:07] Phase started: Planning
- [2026-05-15 16:37] Agent: planner — started planning
- [2026-05-15 16:38] Agent: planner — plan ready in progress/
- [2026-05-15 16:38] Phase complete: Planning
- [2026-05-15 16:44] Phase started: Implementation
- [2026-05-15 16:46] Agent: fullstack-developer — implementation started
- [2026-05-15 16:51] Agent: fullstack-developer — continuing commit 5 (removing order field + simplifying use case)
- [2026-05-15 17:00] Agent: fullstack-developer — rework: replace MDX with InMemory + remove order field
- [2026-05-15 17:29] Agent: fullstack-developer — fix: replace function props with template strings for client boundary
- [2026-05-17 18:36] Agent: fullstack-developer — fix: function→template + hydration + mobile + 11 testimonials (4 issues in one pass)
- [2026-05-17 19:10] Agent: fullstack-developer — replace placeholders with 11 real testimonials + configure media.licdn.com
- [2026-05-17 19:30] Agent: fullstack-developer — replace placeholders with 11 real testimonials + synthetic test fixtures + media.licdn.com
- [2026-05-17 20:15] Agent: fullstack-developer — 11 real testimonials with local avatars + synthetic test fixtures + remove media.licdn.com remotePattern
- [2026-05-17 20:40] Sub-task added: fix slider card showing too much empty space when quote is short (planning)
- [2026-05-17 19:47] Agent: planner — started planning sub-task (slider empty space when quote is short)
- [2026-05-17 19:47] Agent: planner — plan ready in progress/PLAN-testimonials-slider-empty-space.md
- [2026-05-18 00:00] Agent: fullstack-developer — started fix: altura natural por par, alineadas arriba (slider empty space)
- [2026-05-18 10:00] Sub-task started: replace slider with masonry (iteration 2)
- [2026-05-18 10:30] Agent: fullstack-developer — masonry implemented: testimonials-masonry.tsx created, testimonials-section.tsx updated, slider deleted, i18n updated, tests passing (50 files / 375 tests green)
- [2026-05-18 10:45] Agent: code-reviewer — review started (sub-task: replace slider with masonry)
- [2026-05-18 10:55] Agent: code-reviewer — review complete: VERDICT PASS — REVIEW-testimonials-masonry.md written; type-check has only the 27 preexisting use-case-test errors (unrelated), pnpm test 375/375 green, no slider residuals, synthetic fixtures only
- [2026-05-18 11:10] Agent: ux-ui-designer — started exploration: 3-4 design options to show ALL 11 testimonials on About page (destination of home CTA)
- [2026-05-18 11:25] Agent: ux-ui-designer — exploration ready: 4 options (A masonry 3col + ribbon, B pull-quote + lista editorial, C sub-secciones por contexto, D masonry + index sticky). Recommendation: B. Doc at .claude/workspace/planning/DESIGN-testimonials-about-page.md
- [2026-05-18 11:35] Agent: ux-ui-designer — brief trimmed to ~940 words, doc finalized.
- [2026-05-18 18:59] Agent: planner — started planning Option B (pull-quote + editorial list) for About
- [2026-05-18 19:00] Agent: planner — plan ready in progress/PLAN-testimonials-about-option-b.md
- [2026-05-18 19:30] Agent: fullstack-developer — started iteration 2: pull-quote visual refinements + testimonial-row Variant B restructure
- [2026-05-18 19:35] Agent: fullstack-developer — iteration 2 complete: testimonial-pull-quote.tsx and testimonial-row.tsx updated; type-check 27 preexisting errors only; 375/375 tests green; DESIGN-testimonials-about-iteration-2.md moved to review/
- [2026-05-18 19:41] Agent: code-reviewer — review started (sub-task: About Option B + iteration 2)
- [2026-05-18 19:55] Agent: code-reviewer — review complete: VERDICT FAIL-TESTS — production code clean (server components, explicit types, ?? not ||, hover/sizes per iteration 2 spec, i18n keys correct, computeInitials extracted, scroll-mt-24 anchor); 4 test files declared in plan as CREATE are missing (initials.test.ts, testimonial-pull-quote.test.tsx, testimonial-row.test.tsx, testimonials-about-section.test.tsx). pnpm type-check shows only 27 preexisting errors; pnpm test 375/375 green but no new component is covered. See REVIEW-testimonials-about-option-b.md
- [2026-05-18 20:00] Agent: test-writer — started: creating 4 missing test files for computeInitials, TestimonialPullQuote, TestimonialRow, TestimonialsAboutSectionContent
- [2026-05-18 20:10] Agent: test-writer — complete: 4 test files created (25 new tests); pnpm type-check 27 preexisting errors only (0 new); pnpm test 54 files / 400 tests green (was 375)
- [2026-05-18 20:15] Agent: fullstack-developer — started chore: fix 27 preexisting type-check errors in use-case tests (missing locale param)
- [2026-05-18 20:20] Agent: fullstack-developer — complete: 12 test files fixed (27 execute() calls updated with locale "es"); pnpm type-check 0 errors; pnpm test 54 files / 400 tests green
