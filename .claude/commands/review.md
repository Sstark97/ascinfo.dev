# Quick Code Review

Quick review of uncommitted changes against ascinfo.dev coding standards.

## Steps

1. Run `git diff` (unstaged) and `git diff --staged` (staged) to see all changes.
2. Run `pnpm type-check` to check TypeScript errors.
3. Read `.claude/skills/clean-code.md` for coding standards.
4. Check each changed file against the standards:
   - TypeScript: no `any`, explicit return types, `??` not `||`
   - Architecture: domain has no framework imports, use cases use `execute()`
   - React: no `useEffect` for derived state, explicit props interfaces
   - Tests: `describe/it/should` naming, mock at repository level
5. Report violations with file:line references.
6. If no violations: confirm "Código conforme a los estándares." in Spanish.
