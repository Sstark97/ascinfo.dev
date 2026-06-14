# Anti-Patterns (BANNED)

## No `any` Type

`any` defeats TypeScript's purpose. Always find the right type.

```typescript
// WRONG
function processPost(post: any): any { ... }
const data: any = await fetch(url)

// CORRECT
function processPost(post: PostDto): string { ... }
const data: unknown = await fetch(url)
// Then narrow with type guard or zod parse
```

## No Implicit Return Types on Functions

Every function must declare its return type explicitly.

```typescript
// WRONG
async function getAllPosts() {   // What does it return?
  return await repository.readAll()
}

// CORRECT
async function getAllPosts(): Promise<Post[]> {
  return await repository.readAll()
}
```

## `||` for Nullish Checks

Use `??` when you want to fall back on `null` or `undefined` only. `||` falls back on ALL falsy values (0, "", false).

```typescript
// WRONG — breaks for empty string, 0, false
const title = post.seoTitle || post.title

// CORRECT — only falls back on null/undefined
const title = post.seoTitle ?? post.title
```

## No Default Exports in `src/lib/`

Default exports make refactoring harder and hide the real name.

```typescript
// WRONG
export default class GetAllPosts { ... }
export default function getAllPosts() { ... }

// CORRECT
export class GetAllPosts { ... }
export function getAllPosts() { ... }
```

Components (`components/`, `app/`) may use default exports if required by Next.js page conventions.

## No `useEffect` for Data Derivation

If you can compute a value from props or state during render, do it — don't use a `useEffect` + `setState` dance.

```typescript
// WRONG — unnecessary effect for derived state
const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
useEffect(() => {
  setFilteredPosts(posts.filter(p => p.tags.includes(selectedTag)))
}, [posts, selectedTag])

// CORRECT — derive during render
const filteredPosts = posts.filter(p => p.tags.includes(selectedTag))
```

## No Comments Explaining What the Code Does

Rename the function/variable instead.

```typescript
// WRONG — comment restates the code
// Get posts sorted by date descending
const sorted = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

// CORRECT — name explains the intent
const newestFirst = (a: Post, b: Post): number =>
  new Date(b.date).getTime() - new Date(a.date).getTime()
const postsByDate = posts.sort(newestFirst)
```

## No `null` — Prefer `undefined`

Unless a library requires `null` (e.g., Notion SDK returns `null`), always use `undefined` for missing values.

```typescript
// WRONG
const focusKeyword: string | null = null

// CORRECT
const focusKeyword: string | undefined = undefined
```

## No `as` Type Assertions Without Validation

Type assertions bypass type safety. If you must narrow, use a type guard.

```typescript
// WRONG — pretending the type is what you want
const post = data as Post

// CORRECT — validate at the boundary
function isPost(data: unknown): data is Post {
  return typeof data === "object" && data !== null && "slug" in data
}
```

## No Direct `process.env` Access in Components or Use Cases

Environment variables are only read in infrastructure (Container.ts, config files).

```typescript
// WRONG — in a component or use case
const apiKey = process.env.NOTION_API_KEY

// CORRECT — only in Container.ts or config
// Component receives typed config via props or context
```
