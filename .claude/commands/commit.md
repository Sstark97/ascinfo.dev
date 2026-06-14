# Conventional Commit

Creates a git commit following the Conventional Commits standard for ascinfo.dev.

## Steps

1. Run `git status` and `git diff --staged` to see staged changes.
2. Analyze the changes to determine the appropriate type and scope.
3. Draft a commit message following the format below.
4. Show the message to the user and ask for confirmation before committing.
5. After confirmation, run `git commit -m "..."`.

## Format

```
<type>(<scope>): <description>

[optional body]
```

## Types

- `feat` — new feature or page
- `fix` — bug fix
- `refactor` — code change that neither fixes a bug nor adds a feature
- `test` — adding or updating tests
- `style` — CSS/Tailwind changes (no logic change)
- `content` — adding or updating MDX content files
- `chore` — tooling, config, dependencies
- `docs` — documentation changes

## Scopes

- `blog` — blog posts feature
- `projects` — projects feature
- `talks` — talks feature
- `home` — home page
- `about` — about/career page
- `seo` — SEO metadata or schema
- `notion` — Notion CMS adapter
- `mdx` — MDX content rendering
- `i18n` — internationalization
- `ui` — shared UI components
- `infra` — infrastructure/Container

## Examples

```
feat(blog): add tag filtering with multi-select support
fix(notion): handle missing lastModified field gracefully
refactor(seo): extract schema builders to dedicated classes
test(blog): add E2E tests for tag filtering flow
content(blog): add post about TypeScript performance patterns
chore: update pnpm to 9.14.4
```

## Language

- Commit messages: English
- User communication: Spanish
