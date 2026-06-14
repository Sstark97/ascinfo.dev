# Code Review: Commit 7 — Reading progress + micro-interactions (section 9)

## VERDICT: FAIL-TESTS

Production code meets all standards (no `any`, explicit return types, `??` over `||`, passive listeners, rAF throttling, reduced-motion handled, ViewTransition typed correctly). Type-check passes with 0 errors and all 411 unit/component tests are green. However, the new `ScrollToTopButton` client component ships with **zero tests**, despite being explicitly required by the plan and containing branching behavior (threshold visibility + `prefers-reduced-motion` scroll branch). This blocks PASS, but no production code needs to change — only the missing test must be written.

## Files Reviewed

- app/[locale]/blog/[slug]/page.tsx
- app/[locale]/layout.tsx
- app/[locale]/sobre-mi/page.tsx
- app/globals.css
- next.config.mjs
- package.json
- components/bento/featured-posts-block.tsx
- components/bento/featured-project-block.tsx
- components/bento/hero-stats-block.tsx
- components/bento/latest-article-block.tsx
- components/bento/navigation-dock.tsx
- components/bento/profile-block.tsx
- components/bento/recent-talk-block.tsx
- components/detail/reading-progress-bar.tsx
- hooks/use-scroll-progress.ts
- components/ui/scroll-to-top-button.tsx
- types/react-canary.d.ts
- tests/hooks/use-scroll-progress.test.tsx
- tests/components/detail/reading-progress-bar.test.tsx

## Issues Found

### Critical (MUST fix)

- [tests/components/ui/scroll-to-top-button.test.tsx] MISSING. `components/ui/scroll-to-top-button.tsx` is a new client component with non-trivial behavior and has no test. The plan (Testing Requirements + Files to Create) explicitly requires `tests/components/ui/scroll-to-top-button.test.tsx` covering: hidden initially, becomes visible past threshold, `window.scrollTo` smooth on click, `window.scrollTo` auto when `prefers-reduced-motion: reduce`, accessible name via `aria-label`. The directory `tests/components/ui/` exists but is empty. This is the sole blocker.

### Important (SHOULD fix)

- [package.json:82-83] `@types/react` and `@types/react-dom` were pinned from `^19` to exact `19.2.15` / `19.2.3`. The plan's acceptance criterion states "Sin nuevas dependencias en `package.json` además del bump de `next`." This is a devDependency version pin (not a new dependency) and is reasonably justified — the exact `@types/react` version is what makes `react/canary` typings resolve so `import { ViewTransition } from "react"` type-checks without the banned `unstable_` alias. Acceptable, but it is outside the literal stated scope and should be called out in the commit body so the bump is intentional and traceable.
- [tests/hooks/use-scroll-progress.test.tsx:1] Stray `"use client"` directive at the top of a Vitest test file. It is inert (Vitest ignores it) but semantically wrong — test files are not React Server/Client module boundaries. Remove for cleanliness. (Test-code nit; does not affect the verdict beyond FAIL-TESTS.)

### Suggestions (COULD improve)

- [tests/hooks/use-scroll-progress.test.tsx] The "should remove scroll listener on unmount" test asserts `removeEventListener("scroll", ...)` but does not assert the `resize` listener is also removed, nor that `cancelAnimationFrame` runs on a pending frame. Optional extra coverage.
- [components/detail/reading-progress-bar.tsx:14-16] The `useEffect` that resolves `document.getElementById(targetId)` into the ref runs after first paint, so the very first `useScrollProgress` render computes against `documentElement` until the effect fires. Functionally fine (it self-corrects on the first scroll/resize), but a brief 1-frame fallback exists. Not worth changing.

## What Went Well

- No `any` anywhere in the new hook, components, or tests (verified by grep and `skipLibCheck`-aware type-check).
- Every function has an explicit return type: `useScrollProgress(...): UseScrollProgressResult`, `calculateProgress(): void`, `scheduleUpdate(): void`, `scrollToTop(): void`, components return `React.ReactElement`.
- Defaults use destructuring defaults (`threshold = 600`, `label = "Reading progress"`) and the reduced-motion branch is a clean ternary — no `||` nullish abuse.
- Performance done right: both `scroll`/`resize` listeners are `{ passive: true }`, coalesced via `requestAnimationFrame`, with frame cancellation and listener removal in cleanup. `frameRef` uses `number | undefined` (not `null`), aligned with the undefined-over-null rule.
- `prefers-reduced-motion` handled in both layers: JS (`ScrollToTopButton` switches `behavior` to `"auto"`) and CSS (view-transition pseudo-element block zeroing animation duration/delay), as the plan prescribed.
- ViewTransition integration follows the binding rule exactly: `import { ViewTransition } from "react"` with NO `unstable_` alias. Typings are provided cleanly via `types/react-canary.d.ts` (`/// <reference types="react/canary" />`), picked up by the tsconfig `**/*.ts` glob — a tidier approach than the inline `as unknown as React.FC` cast the plan offered as fallback. Layout stays a Server Component. `experimental.viewTransition: true` (singular) set correctly.
- Bento hover homogenization is exact across all 7 blocks: every one now uses `hover:border-[#FCA311]/30 hover:shadow-[0_0_30px_rgba(252,163,17,0.05)]` with `transition-all duration-300` preserved; `featured-project` and `recent-talk` correctly retain `hover:-translate-y-1`.
- Accessibility: progress bar exposes `role="progressbar"` with valuemin/now/max + aria-label; scroll-to-top button has `aria-label` + `sr-only` text + `aria-hidden` icon + visible focus ring.
- Reading bar mounted as a sibling of the header with `id="article-content"` on the `<article>`, avoiding prop drilling exactly as the plan decided. ScrollToTopButton mounted selectively on blog detail and sobre-mi only (not global).
- Type-check: 0 errors. Tests: 56 files / 411 tests passing, including the 6 hook tests and 5 reading-progress-bar tests.

## Recommendation

FAIL-TESTS. Production code is correct and requires no changes — do NOT re-run the developer. Invoke the test-writer instead:

`test-writer: ScrollToTopButton`

Required test file: `tests/components/ui/scroll-to-top-button.test.tsx` with cases (per plan):
- should be hidden initially (opacity-0 / pointer-events-none class state)
- should become visible when scroll exceeds threshold (dispatch scroll with `window.scrollY` stubbed above 600)
- should call `window.scrollTo` with `behavior: "smooth"` on click when reduced motion is not preferred
- should call `window.scrollTo` with `behavior: "auto"` on click when `matchMedia("(prefers-reduced-motion: reduce)").matches` is true
- should expose accessible name via `aria-label`

Conventions: `describe("ScrollToTopButton", () => { it("should ...") })`, `vi.fn()` mocks, stub `window.matchMedia` / `window.scrollTo` / `requestAnimationFrame`, no `any`, synthetic data only.

Optional (not blocking): remove the stray `"use client"` line from `tests/hooks/use-scroll-progress.test.tsx`, and note the `@types/react`/`@types/react-dom` pin in the commit message.
