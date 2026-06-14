@.claude/skills/clean-code.md
@.claude/skills/naming.md
@.claude/skills/testing.md
@.claude/skills/anti-patterns.md

# ascinfo.dev — Project Rules

## Project Identity

ascinfo.dev is the personal portfolio website of Aitor Santana. It showcases blog posts, projects, and talks, with MDX files as the primary content source and an optional Notion CMS adapter.

## Tech Stack

**Runtime & Framework:**
- Next.js 16 with App Router (`app/` directory)
- React 19
- TypeScript 5.9 (strict mode)
- pnpm 9.14.4

**UI:**
- Tailwind CSS v4
- Radix UI primitives
- shadcn/ui components in `components/ui/`
- next-intl for i18n (locale-aware routes)

**Content:**
- MDX files in `src/content/{posts,projects,talks}/`
- Notion CMS adapter (`src/lib/content/infrastructure/notion/`)
- Switchable via `CMS_PROVIDER=notion` env variable

**Testing:**
- Vitest + React Testing Library for unit and component tests
- Playwright for E2E tests

## Architecture

**Hexagonal Architecture** (folder separation within `src/lib/`):

```
Domain (pure logic, zero framework deps)
    ↑
Application (use cases, depend on domain interfaces)
    ↑
Infrastructure (MDX/Notion repos, Container.ts wiring)
    ↑
Next.js App Layer (Server Components, API Routes)
```

**Dependency Rule:** Every layer only imports from the layer below it. Never skip layers.

**Key Files:**
- `src/lib/content/domain/` — entities, value objects, repository interfaces
- `src/lib/content/application/use-cases/` — use cases with `execute()` method
- `src/lib/content/infrastructure/` — MDXContentRepository, NotionContentRepository
- `src/lib/content/infrastructure/Container.ts` — ONLY place that wires deps

## Coding Standards

**Mandatory reference:** `.claude/skills/clean-code.md`

Key rules:
- NO `any` types — find the right type or use `unknown`
- ALL functions have explicit return types
- Use `??` not `||` for nullish checks
- Named exports in `src/lib/` (no default exports)
- Use cases use `execute()` — never `run()`, `invoke()`, `handle()`
- Domain layer: ZERO imports from Next.js, Notion SDK, or any framework
- Server Components by default — `"use client"` only when necessary

## Testing Strategy

**Unit tests** (`tests/lib/`): Vitest, mock at repository interface level
**Component tests** (`tests/components/`): React Testing Library
**E2E tests** (`tests/app/`): Playwright

Test file mirrors source file structure:
- `src/lib/content/application/use-cases/posts/GetAllPosts.ts`
- `tests/lib/content/application/use-cases/posts/GetAllPosts.test.ts`

## Build Commands

```bash
# Development
pnpm dev

# TypeScript check (must pass: 0 errors)
pnpm type-check

# Unit + component tests (must pass: all green)
pnpm test

# E2E tests
pnpm test:e2e

# Production build
pnpm build
```

## Commit Rules

**Format:** Conventional Commits (English)

```
<type>(<scope>): <description>
```

**Types:** `feat`, `fix`, `refactor`, `test`, `style`, `content`, `chore`

**Scopes:** `blog`, `projects`, `talks`, `home`, `about`, `seo`, `notion`, `mdx`, `i18n`, `ui`, `infra`

**Pre-commit Requirements:**
- `pnpm type-check` passes (0 errors)
- `pnpm test` passes (all tests green)

## Language Convention

- **User communication:** Spanish
- **Code:** English (variables, functions, classes)
- **Commits:** English
- **Content (MDX):** Spanish (it's Aitor's portfolio in Spanish)

## Design System

**Tokens clave:**
- Fondo: `#1a1a1a` (página), `#222222` (tarjeta)
- Acento: `#FCA311` (naranja)
- Bordes: `border-white/5` → hover `border-white/10`
- Tarjeta base: `rounded-xl border border-white/5 bg-[#222222] p-6 transition-all duration-300`
- Labels/UI: `font-mono text-xs uppercase tracking-wider text-muted-foreground`

**Componentes propios:** `components/bento/`, `components/listings/`, `components/detail/`, `components/templates/`, `components/career/`

## Agent Workflow

When implementing features:
1. Read this file (`CLAUDE.md`) for project context
2. Read `.claude/skills/clean-code.md` for coding standards
3. Use `.claude/workspace/` for task coordination (see MECHANICS.md)
4. Use `/do-task` for full Plan → Implement → Review pipeline
5. For UI/screen changes: use `ux-ui-designer` first → then `planner` → then `fullstack-developer`
6. Always verify typecheck and tests pass before completion
