# Naming Conventions (MANDATORY)

Semantic, readable names everywhere. No abbreviations, no technical noise.

## TypeScript — General Rules

- **Classes**: PascalCase — `PostRepository`, `GetAllPosts`, `SeoMetadata`
- **Interfaces**: PascalCase, no `I` prefix — `ContentRepository`, not `IContentRepository`
- **Functions/Methods**: camelCase — `getAllPosts()`, `createPost()`
- **Variables**: camelCase, semantic — `sortedPosts`, `featuredProject`
- **Constants**: SCREAMING_SNAKE_CASE for module-level — `POSTS_DIR`, `DEFAULT_LOCALE`
- **Types**: PascalCase — `PostFrontmatter`, `Locale`
- **Files**: kebab-case for utilities, PascalCase for classes/components

## Variables — Semantic Names

```typescript
// WRONG — numbers, abstract suffixes
const post1 = posts[0]
const itemA = projects[0]
const p = await getPostBySlug(slug)

// CORRECT — semantic names expressing intent
const latestPost = posts[0]
const featuredProject = projects[0]
const post = await getPostBySlug(slug)
```

## Use Cases — Method Naming

- Public method is always `execute()` — not `run()`, `invoke()`, `handle()`
- Async use cases: `async execute(params): Promise<ReturnType>`

```typescript
// CORRECT
export class GetAllPosts {
  async execute(locale: Locale): Promise<Post[]> { ... }
}

// WRONG
export class GetAllPosts {
  async run(locale: Locale) { ... }   // WRONG: not execute
  async invoke(locale: Locale) { ... } // WRONG: not execute
}
```

## React Components

```typescript
// CORRECT — explicit props interface, semantic name
interface BlogCardProps {
  post: PostDto
  locale: Locale
}

export function BlogCard({ post, locale }: BlogCardProps): JSX.Element { ... }

// WRONG — inline props, no return type, abbreviated name
export function BC({ p, l }: { p: any, l: any }) { ... }
```

## Factories and Builders

- Factory methods: `create()`, `fromFrontmatter()`, `fromNotionBlock()`
- NO `build()` unless it's a builder pattern
- NO `make()` or `new()` as method names

```typescript
// CORRECT
Post.create(slug, frontmatter, content)
SeoMetadata.fromFrontmatter(frontmatter)

// WRONG
Post.build(slug, frontmatter, content)
Post.newPost(slug, frontmatter, content)
```

## Test Names

Pattern: `describe("ClassName", () => { describe("method()", () => { it("should description") })`

```typescript
// CORRECT
describe("Post Entity", () => {
  describe("create() static method", () => {
    it("should create a Post instance from frontmatter and content")
    it("should handle post with lastModified field")
  })
})

// WRONG
describe("Post tests", () => {
  test("Post_create_returns_instance") // WRONG: underscores
  it("creates post")                   // WRONG: too vague, no "should"
})
```
