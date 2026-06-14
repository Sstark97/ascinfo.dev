# Code Review: Commit 2 — Contact CTAs, Site Footer & NavigationDock Redesign (Op.4)

## VERDICT: PASS

---

## Files Reviewed

### Production code (modified)
- `app/[locale]/layout.tsx`
- `app/[locale]/page.tsx`
- `app/[locale]/sobre-mi/page.tsx`
- `components/bento/navigation-dock.tsx`
- `messages/es.json`
- `messages/en.json`

### Production code (new)
- `components/footer/site-footer.tsx`
- `components/about/contact-cta-section.tsx`
- `components/icons/linkedin-icon.tsx`
- `components/icons/x-icon.tsx`
- `components/icons/bluesky-icon.tsx`

### Tests (new)
- `tests/components/footer/site-footer.test.tsx`
- `tests/components/about/contact-cta-section.test.tsx`
- `tests/components/icons/linkedin-icon.test.tsx`
- `tests/components/icons/x-icon.test.tsx`
- `tests/components/icons/bluesky-icon.test.tsx`
- `tests/components/bento/navigation-dock.test.tsx`

---

## Verification Results

| Check | Result |
|---|---|
| `pnpm test` | 304/304 passed (40 test files) |
| `pnpm type-check` (current changes) | 27 pre-existing errors, 0 new |
| `pnpm type-check` (with stash, baseline) | Same 27 errors in `tests/lib/.../use-cases/*.test.ts` |
| Diff of errors with/without changes | 0 new errors introduced by commit 2 |

The pre-existing errors are all of the form `"Expected N arguments, but got N-1"` in `tests/lib/content/application/use-cases/*` files due to the i18n locale parameter introduced in earlier commits — entirely outside the scope of this commit.

---

## Acceptance Criteria — Plan Coverage

All criteria from `PLAN-commit-2-contact-ctas.md`:

- [x] `components/footer/site-footer.tsx` with `SiteFooterContent` + async `SiteFooter` wrapper.
- [x] `components/about/contact-cta-section.tsx` with `ContactCtaSectionContent` + async wrapper.
- [x] `components/icons/linkedin-icon.tsx` exporting `LinkedInIcon`.
- [x] `<SiteFooter />` mounted in `app/[locale]/layout.tsx` after `{children}` and before `<Analytics />` inside `NextIntlClientProvider` (line 112).
- [x] Footer renders globally (it's in the locale layout — applies to home, blog, sobre-mi, etc., in ES and EN).
- [x] Email `aitorscinfo@gmail.com` is visible text and `mailto:` href.
- [x] LinkedIn handle `@aitorscinfo` → `https://www.linkedin.com/in/aitorscinfo/`.
- [x] GitHub handle `@Sstark97` → `https://github.com/Sstark97`.
- [x] External links carry `target="_blank"` and `rel="noopener noreferrer"`.
- [x] Copyright year computed with `new Date().getFullYear()` in async wrapper, passed to `Content` via prop (`copyrightText`).
- [x] `<ContactCtaSection />` mounted in `/sobre-mi` after Stack section, before closing `<div className="mx-auto max-w-4xl">` (line 168).
- [x] CTA uses existing `CtaButton` with `href="mailto:aitorscinfo@gmail.com"`.
- [x] i18n keys added to both `messages/es.json` and `messages/en.json` with full parity (verified diff).
- [x] `pnpm type-check` — 0 new errors.
- [x] `pnpm test` — all tests green (304/304).
- [x] Tests cover `SiteFooterContent`, `ContactCtaSectionContent`, `LinkedInIcon`.

## Acceptance Criteria — Adjustments Beyond Plan

The two scope adjustments (centered 5-link footer, NavigationDock Op.4 redesign) are correctly executed:

### Centered footer with X & Bluesky
- [x] Inner wrapper has `text-center` class (line 67 of `site-footer.tsx`); test asserts presence (line 130-135 of `site-footer.test.tsx`).
- [x] Five social links rendered in correct order: Email → LinkedIn → GitHub → X → Bluesky (verified by test at line 37-47 of `site-footer.test.tsx`).
- [x] `XIcon` extracted to `components/icons/x-icon.tsx` with **identical SVG** to original inline version (paths verbatim).
- [x] `BlueskyIcon` extracted to `components/icons/bluesky-icon.tsx` with **identical SVG** to original (verified path attribute).
- [x] Both icons follow the same API pattern as `GithubIconOutline` and `LinkedInIcon` (`React.SVGProps<SVGSVGElement>` with `className` forwarding).
- [x] Social icons removed from `NavigationDock` (no `SOCIAL_LINKS` const remains).

### NavigationDock — Op.4 (Directory + Counts)
- [x] Component receives `postsCount`, `talksCount`, `projectsCount` as props (line 6-10 of `navigation-dock.tsx`); does NOT import `posts`/`talks`/`projects` use cases — purely presentational from a data standpoint.
- [x] `app/[locale]/page.tsx` adds `projects.getAll.execute(l)` to the `Promise.all` (line 32) and passes counts as props (line 132).
- [x] Vertical list with divisor between items (`divide-y divide-white/5`).
- [x] Header with dot + label "Secciones" (DESIGN spec line 109-115).
- [x] Icon wrapper `h-9 w-9 rounded-lg bg-[#1a1a1a]` matches DESIGN spec exactly.
- [x] Count badge `bg-[#FCA311]/10 px-2 py-0.5 font-mono text-xs text-[#FCA311]` matches DESIGN spec.
- [x] About entry has no badge (`count: undefined`); rendering uses `item.count !== undefined` — correct nullish check, not `!item.count` (which would be an anti-pattern).
- [x] `aria-label="Secciones"` (via `t("sectionsLabel")`) on `<nav>` element so screen readers can distinguish from any global nav.
- [x] Arrow icon `ArrowUpRight` with hover translate; correct conditional `ml-auto` placement when no badge present.

---

## Clean Code Compliance

### TypeScript
- [x] No `any` types anywhere (production or tests).
- [x] All exported functions have explicit return types: `React.ReactElement`, `Promise<React.ReactElement>`.
- [x] `??` not `||` — no `||` used for nullish fallbacks. The mock dictionary in `navigation-dock.test.tsx` uses `dict[key] ?? key` correctly.
- [x] `undefined` over `null`: `count: undefined` for the "Sobre mí" entry.
- [x] Named exports throughout `components/`.
- [x] No type assertions (`as`) without validation.
- [x] No `process.env` access in components — URLs and email are module-level constants in `site-footer.tsx` and `contact-cta-section.tsx`.

### Architecture
- [x] No domain-layer changes. Commit stays entirely within `app/`, `components/`, `messages/`. Hexagonal layering respected.
- [x] Server Components by default: `SiteFooter` and `ContactCtaSection` are async server components. `NavigationDock` keeps its `"use client"` (justified by `useTranslations` from `next-intl` client API).

### React
- [x] Explicit props interfaces (`SiteFooterContentProps`, `ContactCtaSectionContentProps`, `NavigationDockProps`).
- [x] No `useEffect` for derived state.
- [x] `Content + async wrapper` pattern correctly applied to both `SiteFooter` and `ContactCtaSection`:
  - `SiteFooterContent` and `ContactCtaSectionContent` do NOT call `getTranslations`. They receive everything via props.
  - The async wrappers (`SiteFooter`, `ContactCtaSection`) load translations and inject them into the Content component.
- [x] Year passed as already-interpolated string (`copyrightText`), keeping `SiteFooterContent` deterministic and freeze-friendly for tests.

### Testing
- [x] Test names follow `describe("ClassName", () => { describe("method() / area", () => { it("should ...") }) })`.
- [x] Tests use `vi`, not `jest`.
- [x] No `any` in test files.
- [x] Mocks at the right boundary: `next-intl` and `@/src/i18n/navigation` are mocked in `navigation-dock.test.tsx` (the only client component test that needs translations); the Content tests are pure prop-driven and need no mocks.
- [x] Test files mirror source structure: `tests/components/footer/`, `tests/components/about/`, `tests/components/icons/`, `tests/components/bento/`.

### i18n parity
Verified `messages/es.json` and `messages/en.json` both add the same keys:
- `nav.sectionsLabel`
- `about.contact.{title,description,primaryLabel,primaryAriaLabel,secondaryLabel,secondaryAriaLabel}`
- `footer.{contactTitle,emailLabel,emailAriaLabel,linkedinLabel,linkedinHandle,linkedinAriaLabel,githubLabel,githubHandle,githubAriaLabel,xLabel,xHandle,xAriaLabel,blueskyLabel,blueskyHandle,blueskyAriaLabel,copyright}`

The `xHandle` and `blueskyHandle` are identical across locales (handles, not translatable). The aria labels and copyright string are properly translated. ICU `{year}` interpolation present in both.

---

## Issues Found

### Critical (MUST fix)
None.

### Important (SHOULD fix)
None.

### Suggestions (COULD improve)

- **`tests/components/bento/navigation-dock.test.tsx:54`** — assertion uses an escaped Tailwind class selector (`.bg-\\[\\#FCA311\\]\\/10`) to verify the absence of the badge for "Sobre mí". This is brittle (any class refactor will break it). A more robust alternative would be to query for the badge by its text content (e.g., assert that no number text exists inside the about link). Not a blocker — the current test passes and is reasonable. (Severity: Suggestion.)

- **`components/footer/site-footer.tsx`** — the five `<li>` items repeat a long, almost-identical anchor markup. Extracting an internal helper component (e.g., `FooterSocialLink({ href, ariaLabel, label, handle, Icon, isExternal })`) would tighten the file and remove ~80 lines of repetition. Non-blocking; the current shape is explicit and readable. (Severity: Suggestion.)

- **`components/icons/github-icon.tsx`** — pre-existing file that was NOT modified in this commit. It's worth noting (for future work, not for this review) that `GithubIcon` / `GithubIconOutline` are missing explicit return types (`React.ReactElement`) — the new icons (`LinkedInIcon`, `XIcon`, `BlueskyIcon`) DO declare them, so the project is now slightly inconsistent. Out of scope for this commit. (Severity: Suggestion.)

- **`components/bento/navigation-dock.tsx:62`** — the conditional `item.count !== undefined ? "" : "ml-auto"` placed inside a template literal works, but a slightly cleaner approach would be to compute a `marginLeftClass` constant above the JSX. Aesthetic only, no functional difference. (Severity: Suggestion.)

---

## What Went Well

- **Disciplined Content + async wrapper pattern.** Both `SiteFooter` and `ContactCtaSection` correctly separate i18n loading from the testable render layer, mirroring the existing `ProfileBlock`/`ProfileBlockContent` and `CareerTimeline`/`CareerTimelineContent` patterns. This is exactly what the plan asked for and is consistently applied.
- **Year interpolation done at the boundary.** Passing `copyrightText` as an already-interpolated string keeps the Content pure and deterministic, eliminating any need to mock `Date` in tests.
- **Icon extraction was literal, not "improved".** The `XIcon` and `BlueskyIcon` SVG paths are byte-identical to the original inline versions in `navigation-dock.tsx`. No silent visual regressions introduced.
- **Accessibility is solid.** All external links carry `target="_blank"` + `rel="noopener noreferrer"` AND aria-labels that explicitly mention "(opens in a new tab)" / "(se abre en una pestaña nueva)" — meeting WCAG 3.2.5. The footer uses `role="contentinfo"` correctly, and the new section uses `aria-labelledby` linked to the heading id.
- **NavigationDock data flow is clean.** The component takes counts as props rather than reaching into the data layer itself — preserves the client/server boundary and makes the component trivially testable.
- **Test coverage is thorough.** Each new icon has 3 tests (render, className forwarding, prop forwarding), the footer has 13 tests, the contact CTA has 7, and the NavigationDock has 5. All meaningful behaviors are covered.
- **i18n parity is complete.** All keys exist in both locales with appropriate translations; ICU interpolation is correctly used for the copyright year.
- **No new dependencies, no scope creep.** The implementation stays within the framework's existing primitives and follows the same Tailwind tokens already in use across the bento.
- **Pre-existing type errors not introduced or worsened.** Verified by stash diff: 27 errors before, 27 after. All in unrelated `tests/lib/.../use-cases/` files due to a pre-existing locale-arg gap.

---

## Recommendation

**PASS.** The implementation faithfully covers the plan's acceptance criteria, the user-requested adjustments (centered 5-link footer, Op.4 NavigationDock redesign), and adheres to the project's clean-code standards (no `any`, explicit return types, named exports, `??` nullish, server-by-default with justified `"use client"` only on `NavigationDock`). All 304 tests pass; no new type errors introduced. The Content + async wrapper pattern is correctly applied, ensuring tests stay decoupled from `next-intl/server` runtime. Suggestions above are non-blocking aesthetic notes for future polish.

Ready to commit.
