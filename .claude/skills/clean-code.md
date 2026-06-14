# Clean Code — ascinfo.dev Standards

Index of all coding standards for this project.

- **naming.md** — TypeScript naming conventions, no abbreviations, semantic names
- **testing.md** — Vitest unit tests, Playwright E2E, patterns and conventions
- **anti-patterns.md** — Banned patterns: `any`, `||` for nullish, implicit return types

---

## Checklist Before Committing

### TypeScript Code
- [ ] No `any` types — use proper types or `unknown`
- [ ] All functions have explicit return types
- [ ] Use `??` instead of `||` for nullish checks
- [ ] Named exports, no default exports in `src/lib/`
- [ ] No inline comments explaining WHAT the code does — rename the function instead
- [ ] Use classes for entities (no raw objects with logic)
- [ ] Use `undefined` over `null` unless a library requires `null`
- [ ] Factory methods return instances, not raw objects

### Architecture
- [ ] Domain layer has NO framework dependencies (no Next.js, no Notion SDK)
- [ ] Repositories are interfaces in domain, implementations in infrastructure
- [ ] Use cases only depend on domain interfaces, never on infrastructure
- [ ] Container.ts is the only place that wires dependencies

### React / Next.js
- [ ] Server Components by default — only add `"use client"` when necessary
- [ ] Explicit TypeScript props interfaces for every component
- [ ] `??` not `||` for default prop values
- [ ] No `useEffect` for data derivation — compute during render instead
- [ ] Tailwind classes, no inline styles

### Test Code
- [ ] Unit tests in `tests/lib/` mirroring `src/lib/` structure
- [ ] Component tests in `tests/components/`
- [ ] E2E tests in `tests/app/`
- [ ] Fixtures in `tests/lib/*/fixtures/` for shared mock data
- [ ] `describe/it` structure, not standalone `test()`
- [ ] Mock with `vi.fn()`, not `jest.fn()`
- [ ] No `any` in test files either

### Build
- [ ] `pnpm type-check` — 0 errors
- [ ] `pnpm test` — all tests pass
- [ ] `pnpm build` — builds without errors

---

## Quick Reference

| Aspect | Do | Don't |
|--------|-----|-------|
| **Types** | `string \| undefined` | `any` |
| **Return types** | `function foo(): string { }` | `function foo() { }` |
| **Nullish** | `value ?? defaultValue` | `value \|\| defaultValue` |
| **Exports** | `export class Foo` | `export default Foo` |
| **Null checks** | `value === undefined` | `!value` |
| **Entities** | `Post.create(slug, frontmatter, content)` | `{ slug, title, ... }` |
| **Use cases** | `useCase.execute(params)` | `useCase.run(params)` |
| **Mocks** | `vi.fn().mockResolvedValue(data)` | Any global state |
| **Fixtures** | `mockMultiplePosts` from fixtures file | Inline repeated mock data |
| **Components** | Props interface + explicit JSX return type | Inline props typing |
