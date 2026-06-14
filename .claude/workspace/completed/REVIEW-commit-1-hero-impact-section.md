# Code Review: Commit 1 — Hero impact section with stats and CTA

## VERDICT: PASS

## Files Reviewed

### Production code (created)
- `hooks/use-count-up.ts`
- `components/bento/hero-stats-block.tsx`
- `components/bento/hero-stats-list.tsx`
- `components/bento/cta-button.tsx`

### Production code (modified)
- `app/[locale]/page.tsx`
- `components/bento/profile-block.tsx`
- `messages/en.json`
- `messages/es.json`

### Tests (created)
- `tests/hooks/use-count-up.test.tsx`
- `tests/components/bento/hero-stats-block.test.tsx`
- `tests/components/bento/hero-stats-list.test.tsx`
- `tests/components/bento/cta-button.test.tsx`
- `tests/components/bento/profile-block.test.tsx`

## Verification Results

| Check | Result |
|---|---|
| `pnpm type-check` errors with commit 1 | 27 |
| `pnpm type-check` errors on `main` (baseline, verified via `git stash`) | 27 |
| **New TS errors introduced by commit 1** | **0** |
| `pnpm test` total | **269/269 green** |
| New tests added by commit 1 | 20 (4 + 5 + 5 + 3 + 3 hook spec set sums to 5 hook + 5 list + 3 block + 4 cta + 3 profile = 20) |

The 27 pre-existing TS errors are unrelated to this commit (missing `locale` parameter in legacy use-case tests under `tests/lib/content/application/use-cases/{posts,projects,talks}/`). They predate the change and are explicitly excluded from this review per the task brief.

## Acceptance Criteria — Coverage

| Criterion | Status |
|---|---|
| Subtitle below "Software Crafter" with one-line impact text, ES+EN | PASS — `profile-block.tsx:25-27` renders `impactSubtitle`, both locales updated. |
| Existing bio paragraphs preserved | PASS — `bio1/bio2/bio3` rich-text rendering preserved in `ProfileBlock` async wrapper. |
| CTA `<a href="mailto:aitorscinfo@gmail.com">` with focus styles + aria-label, before "Home anchor indicator" | PASS — `cta-button.tsx`, mounted in `profile-block.tsx:46-52`, anchor element with `aria-label`, `focus-visible:outline-2 focus-visible:outline-[#FCA311]`. |
| `HeroStatsBlock` full width (`md:col-span-12`) between row 1 and row 2 | PASS — `app/[locale]/page.tsx:100-105` wraps the block in `md:col-span-12`. |
| 4 stats grid: 2x2 mobile / 4-col desktop | PASS — `hero-stats-list.tsx:40` uses `grid-cols-2 md:grid-cols-4`. |
| Posts and talks counts dynamic | PASS — `app/[locale]/page.tsx:24-30` adds `talks.getAll.execute(l)` to `Promise.all`; `heroStats` uses `allPosts.length` and `allTalks.length`. |
| Years and LinkedIn values hardcoded in i18n | PASS — `messages/{es,en}.json` `heroStats.yearsExperience.value/suffix` and `heroStats.linkedinRecommendations.value`. |
| Count-up animates on viewport entry, ~1.2s, ease-out, only once per session | PASS — `use-count-up.ts` Intersection Observer with `threshold: 0.3`, `easeOutCubic`, `1200ms` default duration, `observer.unobserve(entry.target)` on first intersection and `observer.disconnect()` after animation completes. |
| `prefers-reduced-motion: reduce` skips animation and shows final value | PASS — `use-count-up.ts:43-46` short-circuits with `setValue(targetValue)`. |
| `+` suffix only on 3+, integer values otherwise | PASS — `hero-stats-list.tsx:27-29` renders suffix only when defined; only `years-experience` carries `suffix: "+"`. |
| `pnpm type-check` 0 NEW errors | PASS — verified baseline match (27 = 27). |
| `pnpm test` all green | PASS — 269/269. |

## Issues Found

### Critical (MUST fix)
None.

### Important (SHOULD fix)
None.

### Suggestions (COULD improve, non-blocking)

- **`hooks/use-count-up.ts:15-20`** — `parseStatValue` is defined and `export`ed from the hook module, but it is unused by anyone. The same helper is **redefined** locally in `app/[locale]/page.tsx:43-46`. The export in the hook file is dead code and the duplication leaks a concern unrelated to the hook's responsibility (count-up animation). Recommendation: either remove the export from `use-count-up.ts` and keep the local copy in `page.tsx`, or extract to a small `lib/parse-stat-value.ts` and import from both. Not blocking — both implementations are pure, correct, and side-effect free.

- **`hooks/use-count-up.ts:80-83`** — Capturing `ref.current` into `currentRef` at the top of the effect, then attaching the observer there, is fine, but the cleanup uses `observer.disconnect()` directly without re-checking the captured node. That is correct because `disconnect()` is global to the observer; this is just a note that the captured-ref pattern is not used in cleanup (and doesn't need to be). No action needed.

- **`components/bento/hero-stats-block.tsx:1-2`** — Two imports from the same module split into `import { ... }` and `import type { ... }`. They could be merged using `import { HeroStatsList, type HeroStat } from "@/components/bento/hero-stats-list"`. Cosmetic.

- **`tests/hooks/use-count-up.test.tsx:48`** — `mockObserver = new MockIntersectionObserver(() => {})` is created and immediately overwritten when the hook constructs `TrackedObserver`. The line is harmless (defensive default to avoid `undefined`) but slightly confusing. Could be replaced with `mockObserver = undefined as unknown as MockIntersectionObserver`-style placeholder or simply omitted with a non-null assertion later. Cosmetic.

- **`tests/components/bento/hero-stats-list.test.tsx:67-70`** — The test queries by class names (`.font-mono.text-xs.uppercase`). The testing skill prefers role/text/placeholder over CSS classes. Acceptable here because the rule under check is purely visual (typography), but a `toHaveClass` assertion on a specific labeled element would be slightly stronger. Cosmetic.

## Architecture & Standards Audit

### Hexagonal architecture
- Domain layer untouched. No Next.js / Notion SDK leakage.
- Use cases unchanged; the home page composes the existing `posts.getAll` and `talks.getAll` exactly as the plan recommended (no `GetSiteStats` over-engineering).
- `Container.ts` is not modified, consistent with reuse-only strategy.

### TypeScript quality
- No `any` anywhere in the production or test code added by this commit.
- All exported functions have explicit return types: `React.ReactElement`, `Promise<React.ReactElement>`, `number`, `void`, `UseCountUpResult<T>`.
- `??` is used consistently for nullish defaults (`options?.durationMs ?? 1200`, `options?.thresholdRatio ?? 0.3`). No `||` misuse spotted.
- Named exports throughout. No default exports in `src/lib/` (the hook lives in `hooks/`, also using a named export).

### React / Next.js boundaries
- `HeroStatsBlock` and `CtaButton` are server components (no `"use client"`), correct.
- `HeroStatsList` is the only client component (`"use client"` at top), as it owns the `useCountUp` hook. Correct boundary.
- `ProfileBlock` was refactored into an async server wrapper plus a synchronous `ProfileBlockContent` server component for testability — exactly the pattern the plan suggested as an escape hatch (mirrors `CareerTimelineContent`). Excellent decision.
- No `useEffect`-driven data derivation. The `useEffect` inside `useCountUp` is legitimate side-effect work (Observer + RAF lifecycle).

### Test conventions
- All test files use the `describe / it("should ...")` shape. Several files even use the nested `describe("ClassName", () => { describe("scenario", () => { it("should ...") }) })` form (`use-count-up.test.tsx`).
- All Vitest imports come from `"vitest"` (no Jest residue).
- Mocks at the right level: `next/image`, `LanguageSwitcher`, and `useCountUp` are mocked at the boundary of each component test.
- `IntersectionObserver` and `matchMedia` correctly mocked in test files (not globally) per the plan's note.

### Design system
- `CtaButton` uses the orange accent token `#FCA311`, focus ring with `focus-visible:outline-2 outline-offset-2`, micro-translation hover. Matches design tokens.
- `HeroStatsBlock` uses `rounded-xl border border-white/5 bg-[#222222] p-6 transition-all duration-300 hover:border-white/10` — exact base bento class set.
- Labels use `font-mono text-xs uppercase tracking-wider text-muted-foreground`. Matches house style.

### i18n
- Only NEW keys added (`profile.impactSubtitle`, `profile.ctaLabel`, `profile.ctaAriaLabel`, full `home.heroStats.*` subtree). Existing keys (`bio1/bio2/bio3`, etc.) are intact.
- ES and EN are in lock-step (same key shape, both files updated).

## What Went Well

- Clean separation between async server `ProfileBlock` and synchronous, testable `ProfileBlockContent`. This is the most testable shape for a Next.js 16 server component, and it matches an established pattern in the codebase (`CareerTimelineContent`).
- `useCountUp` hook is well-typed, SSR-safe (early return when `window` is undefined), and respects `prefers-reduced-motion`. The cleanup pipeline (cancel RAF + disconnect observer) is correct.
- `HeroStatsBlock` is a server component and only the inner list is client. This minimizes the JS shipped to the browser while keeping the animation interactive.
- Acceptance criteria are 12-of-12 met. No corner cases missed.
- The decision NOT to introduce a `GetSiteStats` use case (just reusing `posts.getAll` + `talks.getAll`) avoids unjustified architectural ceremony.
- Test coverage is proportional and meaningful: the hook is unit-tested with proper IO + matchMedia mocks; the suffix branch is explicitly covered with a positive and a negative case; the CTA's "anchor not button" semantics are asserted.
- 269/269 tests green; zero NEW typecheck errors introduced.

## Recommendation

**PASS — proceed to commit.**

Optional cleanup the implementer can address before pushing (none of these block the commit):

1. Remove the unused `parseStatValue` export from `hooks/use-count-up.ts` (lines 15-20). The hook should not own a domain-unrelated string parser. Keep only the local copy in `app/[locale]/page.tsx`, OR move both to a tiny shared util.
2. Merge the split type/value imports in `components/bento/hero-stats-block.tsx:1-2` into a single line.

Code is ready to ship as-is. The two suggestions above are pure hygiene.
