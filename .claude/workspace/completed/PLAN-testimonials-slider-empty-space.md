# Task: Fix Empty Vertical Space in Testimonials Slider Cards

## Description

In the home page testimonials slider (`components/testimonials/`), each slide is forced to a fixed minimum height of `18rem` (288px). Combined with `flex h-full flex-col` + `flex-1` on the blockquote and the footer at the end of the card, this produces a large empty gap between the quote and the author block whenever the current testimonial is short.

Symptom: long quotes (e.g. "José Cabello Cubero") render correctly, but advancing to a shorter quote leaves a noticeable vertical void above the avatar/name/role footer. The user reports this looks broken.

Root cause is purely visual/CSS — no logic, data, or architecture changes required.

## Acceptance Criteria

- [ ] When the visible testimonial has a short quote, the card height adapts to the content; no large empty band between the end of the blockquote and the footer.
- [ ] When the visible testimonial has a long quote, the card still renders fully (no truncation introduced).
- [ ] In desktop (`md` and up, `visibleCount = 2`), both visible slides in a given page share the same height (no awkward jagged row); but the slider as a whole adjusts page-by-page based on the tallest of the two visible.
- [ ] In mobile (`< md`, `visibleCount = 1`), each slide takes its natural height.
- [ ] No hydration mismatch between SSR (`visibleCount = 1`) and client.
- [ ] Navigation forward and backward keeps height transitions smooth (no layout flicker that breaks the user's flow).
- [ ] All existing unit/component tests in `tests/components/testimonials/` still pass without modification.
- [ ] `pnpm type-check` and `pnpm test` pass.

## Architecture Decisions

Pure presentational fix in two client/server React components under `components/testimonials/`. No domain, application, or infrastructure changes. No new dependencies. No new tests required — this is a visual regression already implicitly covered by the user's eye and the existing render assertions.

### Diagnosis (exact lines causing the empty space)

1. **`components/testimonials/testimonials-slider.tsx:135`** — the slide `<li>` has:
   ```
   className="min-h-[18rem] shrink-0 basis-[88%] md:basis-[calc(50%-0.5rem)]"
   ```
   `min-h-[18rem]` (= 288px) forces every slide to be at least 288px tall regardless of content. This is the primary culprit.

2. **`components/testimonials/testimonial-card.tsx:35`** — the anchor uses `flex h-full flex-col`. Combined with the `<li>`'s `min-h-[18rem]`, the card stretches to 100% of the forced slide height.

3. **`components/testimonials/testimonial-card.tsx:46`** — the `<blockquote>` has `mt-4 flex-1 text-base ...`. The `flex-1` makes the blockquote greedily absorb all leftover vertical space, pushing the footer to the bottom of the card. When the quote is short, this is exactly what produces the visible empty band between the last line of the quote and the avatar.

4. **`components/testimonials/testimonial-card.tsx:46`** — additionally, `line-clamp-8 md:line-clamp-none` clamps to 8 lines on mobile and removes the clamp on desktop. Not the cause of the empty space, but relevant: on desktop, very long quotes render in full, which is desirable but means the natural-height strategy must tolerate a wide variance in heights.

### Strategy decision — Option A (recommended)

**Chosen: Option A — natural height per slide, with per-page equal height between the two desktop slides.**

Justification:
- The user controls the rhythm (manual slider, no autoplay), so a height change between pages is acceptable and even helpful — it tells the user the content has changed.
- Removing the forced `min-h-[18rem]` and the `flex-1` on the blockquote eliminates the empty band at its root, without compromising long quotes (no truncation needed).
- On desktop with `visibleCount = 2`, we keep the two visible cards aligned per page by relying on flex row stretch (default `align-items: stretch` on `flex`), so the shorter of the two visible cards matches the taller. This is the natural flex behaviour and requires no extra rule once we remove `min-h-[18rem]` and let the `<li>` size to its content.
- Trade-off vs. Option B (anchor footer to bottom of a uniform-height card): rejected — Option B explicitly keeps the empty band, which is the very complaint.
- Trade-off vs. Option C/D (line-clamp + "read more" / max-h + scroll): rejected — adds complexity (state, "leer más" copy, i18n keys, accessibility considerations) for a problem that does not require it. Out of scope here.
- Trade-off vs. Option E (justify-center / justify-between): rejected — still leaves the card at a forced height, just redistributes the empty space. The empty space is still there visually.

### Per-page equal height in desktop (`visibleCount = 2`)

The `<ul>` track is `flex gap-4`. By flex default, items align with `stretch` along the cross-axis, so two visible `<li>` siblings will match the taller one automatically — provided we (a) remove `min-h-[18rem]` and (b) remove `flex-1` on the blockquote (so the card no longer forces an internal vertical distribution).

However: the track contains ALL N testimonials (not only the visible two). The flex `stretch` would normally align ALL of them to the tallest in the track, defeating the purpose. We resolve this by:

- Keeping the existing `overflow-hidden` viewport + `translateX` strategy (no change there).
- Letting each `<li>` size to its own content height by ensuring the inner card has `h-full` so all `<li>`s in the same flex row stretch to the row's tallest. Since the track is a single horizontal flex row, ALL `<li>`s stretch to the tallest of the entire row. This means the whole slider row will be as tall as the tallest single testimonial in the dataset.

That is acceptable and is in fact preferable to the current bug, because:
- The tallest testimonial defines the row height (predictable, no per-page jumps).
- The empty band complaint is rooted in `min-h-[18rem]` being LARGER than many quotes need; once removed, the row height equals the tallest natural quote, which is the minimum height needed to avoid truncation. Shorter quotes still show some space at the bottom, but it is the unavoidable space dictated by the tallest sibling — not an arbitrary 288px floor.

If after implementation the residual empty space below short quotes still bothers the user (because the tallest testimonial is much longer than the median), we have an optional follow-up:

- **Optional refinement (NOT part of this plan unless requested):** measure each `<li>` and apply `height: auto` to the track with a JS-driven height swap that animates between pages. This adds complexity (ResizeObserver per slide, height state, transition on `height`). Skip for now; revisit if needed.

A simpler intermediate refinement that DOES fit this plan: center the card content vertically within whatever height the row imposes, so short quotes feel "balanced" rather than top-aligned with a void below. This is achieved by changing the blockquote's `flex-1` (which pushes the footer down) to a neutral natural-height behaviour, and letting the unused space sit equally above the quote SVG and below the footer via `my-auto` on a wrapper. Decision: do NOT add `my-auto` — keep the card top-aligned (quote SVG at top, blockquote, footer right under it). This is the cleanest "no empty band between quote and footer" outcome.

## Files to Create/Modify

- `components/testimonials/testimonials-slider.tsx` (MODIFY) — remove the `min-h-[18rem]` from the slide `<li>` so each slide sizes to content.
- `components/testimonials/testimonial-card.tsx` (MODIFY) — remove `flex-1` from the blockquote so the footer no longer gets pushed to the bottom. Keep `flex h-full flex-col` on the anchor so the card still fills the row height (preserving per-row equal height via flex stretch).

No other files. No tests. No fixtures. No i18n.

## Implementation Steps

1. **Edit `components/testimonials/testimonials-slider.tsx`, line 135.**
   Change:
   ```
   className="min-h-[18rem] shrink-0 basis-[88%] md:basis-[calc(50%-0.5rem)]"
   ```
   to:
   ```
   className="shrink-0 basis-[88%] md:basis-[calc(50%-0.5rem)]"
   ```
   Rationale: removes the artificial 288px floor that creates the empty band.

2. **Edit `components/testimonials/testimonial-card.tsx`, line 46.**
   Change:
   ```
   <blockquote className="mt-4 flex-1 text-base italic leading-relaxed text-gray-100 line-clamp-8 md:line-clamp-none">
   ```
   to:
   ```
   <blockquote className="mt-4 text-base italic leading-relaxed text-gray-100 line-clamp-8 md:line-clamp-none">
   ```
   Rationale: removes `flex-1` so the blockquote occupies only the height of its own text. The footer sits naturally right after the quote, not pinned to the bottom of the card.

3. **Do not** remove `h-full` from the anchor (line 35). The anchor must still fill the `<li>` so that two `<li>`s sharing the same flex row stretch to equal visual height. The two changes together:
   - `<li>` no longer has `min-h-[18rem]` → row height = tallest natural quote in the track.
   - Card has `h-full` → each card visually matches the row height (background fills, border draws all the way down).
   - Blockquote no longer has `flex-1` → quote text and footer cluster at the top of the card; any leftover height is empty card body BELOW the footer (visually closer to the border, looks like padding, not a void between quote and author).

   Outcome: the empty space, if any, sits BELOW the footer rather than BETWEEN quote and footer. That is the visually desired result.

4. **Sanity check** that no other place in `components/testimonials/` references `min-h-[18rem]` or `flex-1` on the blockquote. If found, leave them alone — only the two edits above are needed.

## Testing Requirements

- [ ] No new tests required. The existing tests in `tests/components/testimonials/testimonial-card.test.tsx` and `tests/components/testimonials/testimonials-slider.test.tsx` do not assert on specific Tailwind classes for `min-h-[18rem]` or `flex-1`, so they remain valid.
- [ ] Verify the existing tests still pass: `pnpm test` (focus: `tests/components/testimonials/`).
- [ ] Visual verification (manual, no automation):
  - Open `/` (home) in dev mode.
  - Cycle through ALL testimonials forward via the next arrow and the pagination dots.
  - Cycle backward via the prev arrow.
  - On desktop viewport (`>= 768px`): two cards visible side by side; both cards should have the same height (flex stretch); the height should equal the taller of the two; neither card should show a large void between the quote and the footer — the footer should sit right after the last line of the quote, with any leftover space appearing as additional padding BELOW the footer (and only when paired with a much taller sibling).
  - On mobile viewport (`< 768px`): one card visible; the card height equals its content height; no void below the quote.
  - The `/[locale]/sobre-mi` page also uses `TestimonialsSection` — verify the same behaviour there.
- [ ] Verify no hydration mismatch: open the page with JS disabled or check the SSR HTML — the only client-driven value is `visibleCount` (defaults to 1 in SSR), and the height changes are purely CSS-driven from content, so SSR and client agree on layout.
- [ ] `pnpm type-check` — 0 errors.
- [ ] `pnpm test` — all green.
- [ ] `pnpm build` — builds without warnings related to these files.

## Code Standards Checklist

- [ ] No `any` types introduced (no TS changes at all).
- [ ] All functions retain their explicit return types (no signature changes).
- [ ] `??` not `||` for nullish checks (no logical changes).
- [ ] Named exports preserved.
- [ ] No inline styles added (we only adjust Tailwind class strings).
- [ ] No new `useEffect` or state — purely CSS edits.
- [ ] Server Components remain server, Client Component remains client.

## Complexity Estimate

**S** (Small — under 30 minutes). Two single-line Tailwind class edits, no logic, no tests, no fixtures, no i18n.
