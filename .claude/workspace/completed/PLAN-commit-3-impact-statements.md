# Task: Commit 3 — Impact statements in Career Timeline

## Description

Add 1-2 impact bullets to each professional career item (3 internal Lean Mind projects + NEWE position) in the About page timeline. Bullets are visually distinguishable from the descriptive text (CheckCircle2 icon in `#FCA311` + `text-sm font-medium text-foreground`) and rendered as a semantic `<ul>` between the `description` and the `stack` tag block. Codemotion does not get bullets (it is outreach, not a delivered project).

Data lives in `src/lib/career/career-data.ts` (next to the existing timeline copy) under both `careerDataEs` and `careerDataEn`. A new reusable `ImpactList` Server Component is extracted so it can be rendered both inside `ProjectSubNode` (for the 3 Lean Mind projects) and inside `CareerTimelineContent` (for the NEWE position, which has no `projects`).

Commit: `feat(about): add impact statements to career timeline`.

## Acceptance Criteria

- [ ] `InternalProject` and `CareerPosition` interfaces include an optional `impact?: string[]` field.
- [ ] Both `careerDataEs` and `careerDataEn` arrays contain the impact bullets defined below for: Lean Mind > Fintech B2B & Payments, Lean Mind > Global OTT Platform, Lean Mind > EdTech Platform, NEWE.
- [ ] Codemotion has no `impact` field (or `impact` is `undefined`).
- [ ] A new `components/career/impact-list.tsx` Server Component renders a semantic `<ul>` of bullets, each row with a `CheckCircle2` icon (`text-[#FCA311]`) + `text-sm font-medium text-foreground` text.
- [ ] `ProjectSubNode` renders `<ImpactList>` between its `description` `<p>` and the stack tag row, only when `project.impact` exists and has length > 0.
- [ ] `CareerTimelineContent` renders `<ImpactList>` between the position's `description` `<p>` and the optional position `stack` block, only when `position.impact` exists and has length > 0.
- [ ] `ImpactList` accepts an optional `ariaLabel?: string` prop. Both call sites pass the localized "Impacto"/"Impact" string from `messages/{es,en}.json` under key `career.impactLabel`.
- [ ] No visible "Impact" header is rendered (label is for accessibility only via `aria-label` on the `<ul>`).
- [ ] All existing tests in `tests/components/career/` keep passing without modification (no behavior they assert is removed).
- [ ] New unit/component tests cover the new `ImpactList` component (see Testing Requirements).
- [ ] `pnpm type-check` passes (0 errors).
- [ ] `pnpm test` passes (all green).

## Architecture Decisions

- **Layer placement**: data stays in `src/lib/career/career-data.ts` (existing pattern, single source of truth for timeline copy in both locales). Do NOT move bullets to `messages/*.json` — only the `aria-label` text goes there because it is generic UI chrome.
- **Component reuse**: extract a tiny Server Component `components/career/impact-list.tsx` instead of inlining the same JSX twice. Pure presentational, no state, no `"use client"`.
- **No icon abstraction**: import `CheckCircle2` directly from `lucide-react` inside `ImpactList` (already used elsewhere in the codebase via lucide-react). One icon, one component.
- **Optional field**: `impact?: string[]` (`undefined` = render nothing). This keeps Codemotion and any future entries opt-in without sentinel values.
- **Accessibility**: aria-label on `<ul>` (e.g. `aria-label="Impacto"`) so screen readers announce the list semantically. Visually, bullets stand alone — no header reduces card height pressure on mobile.
- **Naming**: `ImpactList` (PascalCase component, kebab-case file `impact-list.tsx`), prop `items: string[]`, optional `ariaLabel?: string`. Matches project naming conventions.
- **Return type**: explicit `JSX.Element` on `ImpactList`. Existing components in `components/career/` omit return types, but per `clean-code.md` new components MUST declare them.

## Files to Create/Modify

### CREATE

- `components/career/impact-list.tsx` — new Server Component rendering the impact bullets.
- `tests/components/career/impact-list.test.tsx` — unit/component tests for `ImpactList`.

### MODIFY

- `src/lib/career/career-data.ts` — add `impact?: string[]` to both `InternalProject` and `CareerPosition` interfaces; populate bullets for the 4 entries in both `careerDataEs` and `careerDataEn`.
- `components/career/project-sub-node.tsx` — render `<ImpactList items={project.impact} ariaLabel={impactLabel} />` between description and stack tags; accept new prop `impactLabel: string`.
- `components/career/career-timeline.tsx` — render `<ImpactList items={position.impact} ariaLabel={impactLabel} />` between position description and the position-level stack block; pass `impactLabel` down to `ProjectSubNode`. The async wrapper resolves `t("impactLabel")` and forwards it as a prop.
- `messages/es.json` — add `"career": { ..., "impactLabel": "Impacto" }`.
- `messages/en.json` — add `"career": { ..., "impactLabel": "Impact" }`.

## Implementation Steps

### 1. Data layer — `src/lib/career/career-data.ts`

1.1. Extend interfaces:

```ts
export interface InternalProject {
  name: string;
  dateRange: string;
  stack: string[];
  description: string;
  isActive: boolean;
  impact?: string[];   // NEW
}

export interface CareerPosition {
  // ...existing fields...
  impact?: string[];   // NEW
}
```

1.2. Populate `careerDataEs` (Spanish bullets):

- Lean Mind > Fintech B2B & Payments — `impact`:
  - "Diseño e implementación de la integración con proveedores de VCC (tarjetas virtuales) para pagos B2B en el sector travel"
  - "Arquitectura hexagonal con .NET Core para un sistema de facturación electrónica con alta transaccionalidad"
- Lean Mind > Global OTT Platform — `impact`:
  - "Orquestación de microservicios event-driven para la ingesta y distribución de contenido multimedia"
  - "Modernización de pipeline de procesamiento de vídeo"
- Lean Mind > EdTech Platform — `impact`:
  - "Plataforma educativa construida con TDD estricto desde el día 1"
  - "Implementación de pipelines CI/CD con Docker"
- NEWE (top-level position) — `impact`:
  - "Liderazgo técnico del frontend de una plataforma SaaS B2B de logística inversa"
  - "Arquitectura frontend con React + Redux + TypeScript desde cero"
- Lean Mind (top-level position): NO `impact` (it has nested projects which carry the bullets).
- Codemotion: NO `impact`.

1.3. Populate `careerDataEn` (English translations of the exact same bullets, preserving 1:1 ordering):

- Lean Mind > Fintech B2B & Payments — `impact`:
  - "Designed and implemented the integration with VCC (virtual card) providers for B2B payments in the travel sector"
  - "Hexagonal architecture with .NET Core for a high-throughput e-invoicing system"
- Lean Mind > Global OTT Platform — `impact`:
  - "Orchestrated event-driven microservices for ingestion and distribution of multimedia content"
  - "Modernization of the video processing pipeline"
- Lean Mind > EdTech Platform — `impact`:
  - "Education platform built with strict TDD from day one"
  - "CI/CD pipelines implemented with Docker"
- NEWE (top-level position) — `impact`:
  - "Technical leadership of the frontend for a B2B SaaS reverse-logistics platform"
  - "Frontend architecture with React + Redux + TypeScript from scratch"

### 2. i18n — `messages/{es,en}.json`

Extend the existing `career` block (currently only has `active`):

`messages/es.json`:
```json
"career": {
  "active": "Activo",
  "impactLabel": "Impacto"
}
```

`messages/en.json`:
```json
"career": {
  "active": "Active",
  "impactLabel": "Impact"
}
```

### 3. Component — `components/career/impact-list.tsx`

Server Component (no `"use client"`).

```tsx
import { CheckCircle2 } from "lucide-react";
import type { JSX } from "react";

interface ImpactListProps {
  items: string[];
  ariaLabel?: string;
}

export function ImpactList({ items, ariaLabel }: ImpactListProps): JSX.Element | null {
  if (items.length === 0) {
    return null;
  }

  return (
    <ul aria-label={ariaLabel} className="mb-3 flex flex-col gap-2">
      {items.map((statement) => (
        <li
          key={statement}
          className="flex items-start gap-2 text-sm font-medium text-foreground"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FCA311]" aria-hidden="true" />
          <span>{statement}</span>
        </li>
      ))}
    </ul>
  );
}
```

Notes:
- `key={statement}` is safe because each impact statement is unique within a single list (short, hand-written copy). If duplicates ever appear in QA, switch to `${index}-${statement}` — flag as a follow-up only if encountered.
- `aria-hidden="true"` on the icon prevents redundant announcements; the text already carries the meaning.
- Returns `null` for empty input as a defensive guard, even though call sites already short-circuit on `impact?.length`.
- `mb-3` matches the existing spacing between the project `description` and the stack row in `ProjectSubNode`.

### 4. Modify `components/career/project-sub-node.tsx`

4.1. Extend props:

```ts
interface ProjectSubNodeProps {
  project: InternalProject;
  isLast: boolean;
  impactLabel: string;
}
```

4.2. Inside the card body, between the `description` `<p>` and the stack `<div>`:

```tsx
{project.impact && project.impact.length > 0 && (
  <ImpactList items={project.impact} ariaLabel={impactLabel} />
)}
```

4.3. Remove the existing `mb-3` from the description `<p>` ONLY IF the impact list is rendered? — NO. Keep the description `<p>` `mb-3` as-is. The `ImpactList` itself adds its own `mb-3` to separate from the stack row. Test visually; if double-margin looks off in implementation, adjust by dropping `ImpactList`'s `mb-3` — but that's an implementation polish, not a plan-level concern.

4.4. Add explicit return type `JSX.Element` to the function signature (the existing component lacks one — clean-code.md mandates it for new code we touch). This is a small in-scope cleanup; do not refactor anything else.

### 5. Modify `components/career/career-timeline.tsx`

5.1. Extend `CareerTimelineContentProps`:

```ts
interface CareerTimelineContentProps {
  careerData: CareerPosition[];
  activeLabel: string;
  impactLabel: string;
}
```

5.2. Inside the position card, between the position `description` `<p>` and the position `stack` block:

```tsx
{position.impact && position.impact.length > 0 && (
  <div className="mt-4">
    <ImpactList items={position.impact} ariaLabel={impactLabel} />
  </div>
)}
```

The wrapping `mt-4` keeps spacing consistent with the existing `mt-4` on the stack block (currently the description `<p>` has no bottom margin and the stack uses `mt-4`).

5.3. Pass `impactLabel` to `ProjectSubNode`:

```tsx
<ProjectSubNode
  key={`${project.name}-${project.dateRange}`}
  project={project}
  isLast={projectIndex === position.projects!.length - 1}
  impactLabel={impactLabel}
/>
```

5.4. Update the async `CareerTimeline` wrapper:

```tsx
export async function CareerTimeline() {
  const locale = await getLocale();
  const t = await getTranslations("career");
  const careerData = getCareerData(locale);
  return (
    <CareerTimelineContent
      careerData={careerData}
      activeLabel={t("active")}
      impactLabel={t("impactLabel")}
    />
  );
}
```

5.5. Add explicit return type `JSX.Element` to `CareerTimelineContent`.

5.6. Import `ImpactList` from `./impact-list`.

## Testing Requirements

### New file: `tests/components/career/impact-list.test.tsx`

Use Vitest + React Testing Library. Follow the project pattern: `describe("ComponentName", () => { it("should ...") })`.

Cases (4 tests):

1. **renders one `<li>` per item**
   - Arrange: `items = ["Bullet A", "Bullet B", "Bullet C"]`.
   - Act: render `<ImpactList items={items} />`.
   - Assert: `screen.getAllByRole("listitem")` has length 3, and each bullet text is in the document.

2. **applies the provided `aria-label` to the `<ul>`**
   - Arrange: `items = ["x"]`, `ariaLabel = "Impacto"`.
   - Act: render `<ImpactList items={items} ariaLabel={ariaLabel} />`.
   - Assert: `screen.getByRole("list", { name: "Impacto" })` is in the document.

3. **renders nothing when `items` is empty**
   - Arrange: `items = []`.
   - Act: `const { container } = render(<ImpactList items={items} />)`.
   - Assert: `container.firstChild` is `null` (or `screen.queryByRole("list")` is `null`).

4. **renders an icon per bullet (visual marker)**
   - Arrange: `items = ["a", "b"]`.
   - Act: `const { container } = render(<ImpactList items={items} />)`.
   - Assert: `container.querySelectorAll("svg").length === 2`. Lucide icons render as `<svg>` elements. This guards against accidental icon removal.

### Existing test files — verify still passing (no edits required)

- `tests/components/career/project-sub-node.test.tsx` — current cases only assert name, dateRange, badge, stack, description, dashed line and indicator styling. None of those are removed by adding an optional list between description and stack. The component's new required prop `impactLabel` will need a default value passed in the existing tests; **add** `impactLabel=""` to every existing `<ProjectSubNode .../>` render call in the file. This is the smallest change to keep tests green without rewriting them.
- `tests/components/career/career-timeline.test.tsx` — current cases use `getCareerData("es")` and assert headings, badges, projects, location, stack tags. They render `CareerTimelineContent` directly; **add** `impactLabel="Impacto"` to every existing render call.

### Test execution

- [ ] `pnpm test tests/components/career/impact-list.test.tsx` — all 4 new cases pass.
- [ ] `pnpm test` — full suite green.
- [ ] `pnpm type-check` — 0 errors.

## Code Standards Checklist

- [ ] No `any` types in new code.
- [ ] Explicit return types on `ImpactList`, `CareerTimelineContent`, and `ProjectSubNode` (the latter two get the cleanup as we're already touching them).
- [ ] `??` used for any nullish defaults (none needed in this change, but verify).
- [ ] Named exports only — `export function ImpactList` (no default).
- [ ] No inline comments explaining what the code does.
- [ ] `undefined` (not `null`) for absent `impact` field.
- [ ] No `as` type assertions.
- [ ] No `process.env` in components.
- [ ] Server Component (no `"use client"`).
- [ ] Tailwind classes only, no inline styles.
- [ ] PascalCase component, kebab-case file (`impact-list.tsx`).
- [ ] Test file mirrors source path: `tests/components/career/impact-list.test.tsx`.
- [ ] `describe/it` with `should` phrasing.

## Risks

- **Mobile overflow**: long Spanish/English bullets with the icon column may wrap awkwardly on narrow viewports inside `ProjectSubNode` (which already lives behind a 24px-padded card on a sub-timeline rail). `flex items-start gap-2` + `shrink-0` on the icon plus `<span>` for the text keeps wrap behaviour predictable, but verify visually at 320px width during implementation. If problems appear, the fix is `min-w-0` on `<span>` or reducing `gap-2` to `gap-1.5`.
- **Spacing consistency in `ProjectSubNode`**: the description `<p>` currently has `mb-3` and the stack tags follow directly. Inserting `<ImpactList>` (with its own `mb-3`) between them must not produce visible double spacing. Implementation should render and screenshot at the test stage; if doubled, drop `mb-3` from `ImpactList` and rely on the existing `mb-3` on the description plus `mt-3` (new) on the stack — or simpler, keep `ImpactList`'s `mb-3` and remove the `mb-3` from the description's `<p>` only when `impact` is present (small ternary on className).
- **Existing test breakage**: adding the required prop `impactLabel` to `ProjectSubNode` and `CareerTimelineContent` makes their existing tests fail at compile time until we add the prop. The plan covers this in Testing Requirements step "Existing test files".
- **i18n key discoverability**: putting `impactLabel` under the existing `career` namespace (rather than `about`) keeps the namespace cohesive with `active`, but reviewers may expect it under `about`. Decision: keep `career.impactLabel` since `career-timeline.tsx` already calls `getTranslations("career")`.
- **Accessibility duplication**: the icon is `aria-hidden="true"` and the `<ul>` carries `aria-label`. Screen readers should announce "Impact, list, 2 items" then each bullet text — verified pattern, no risk.
- **Codemotion data shape**: confirming the omission — the entry has no `projects` and no `impact`. Renderer code must short-circuit on `impact?.length`, never on `position.projects` alone, otherwise Codemotion would render an empty list. The proposed JSX uses `position.impact && position.impact.length > 0` which is correct.

## Complexity Estimate

S (Small, ~1.5h):
- ~25 lines new component + 4 small tests.
- Edits to 4 files (data, 2 components, 2 messages files).
- No architectural decisions left open. No new infrastructure. No use case changes.
