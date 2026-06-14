# Testing Conventions (MANDATORY)

## Structure

```
tests/
├── lib/                    # Unit tests — mirrors src/lib/
│   └── content/
│       ├── domain/         # Entity and value object tests
│       ├── application/    # Use case tests (mock repositories)
│       ├── infrastructure/ # Integration tests (real MDX parsing, etc.)
│       └── fixtures/       # Shared mock data
├── components/             # Component tests (React Testing Library)
└── app/                    # E2E tests (Playwright)
```

## Unit Tests — Vitest

### Naming

Pattern: `describe("ClassName", () => { describe("method()", () => { it("should <behavior>") })`

```typescript
// CORRECT
describe("GetAllPosts", () => {
  it("should return all posts sorted by date (newest first)", async () => { ... })
  it("should return empty array when no posts exist", async () => { ... })
})

// WRONG
test("GetAllPosts works")           // WRONG: no describe, no "should"
it("returns sorted posts")          // WRONG: no "should"
describe("GetAllPosts tests", () => { // WRONG: "tests" suffix is redundant
  test("test1", () => { ... })      // WRONG: "test1" not descriptive
})
```

### Structure: Arrange-Act-Assert

```typescript
it("should return all posts sorted by date (newest first)", async () => {
  // Arrange
  const mockRepo: ContentRepository = {
    readAll: vi.fn().mockResolvedValue(mockMultiplePosts),
    readBySlug: vi.fn(),
  }
  const useCase = new GetAllPosts(mockRepo)

  // Act
  const posts = await useCase.execute()

  // Assert
  expect(posts).toHaveLength(3)
  expect(posts[0].slug).toBe("post-3") // newest first
})
```

### Use Case Tests — Mock at Repository Level

```typescript
import { describe, it, expect, vi } from "vitest"

describe("GetAllPosts", () => {
  it("should ...", async () => {
    const mockRepo: ContentRepository = {
      readAll: vi.fn().mockResolvedValue(mockData),
      readBySlug: vi.fn(),
    }
    const useCase = new GetAllPosts(mockRepo)

    const result = await useCase.execute()

    expect(result).toHaveLength(2)
  })
})
```

### Entity Tests — Factory method then assert properties

```typescript
describe("Post Entity", () => {
  describe("create() static method", () => {
    it("should create a Post with required fields", () => {
      const frontmatter = createPostFrontmatter()  // local factory helper

      const post = Post.create("test-slug", frontmatter, "Content")

      expect(post.slug).toBe("test-slug")
      expect(post.title).toBe(frontmatter.title)
    })
  })
})
```

### Fixtures — Shared Mock Data

Create fixtures for data reused across multiple tests:

```typescript
// tests/lib/content/fixtures/posts.fixtures.ts
export const mockSinglePost = {
  slug: "test-post",
  frontmatter: { title: "Test Post", date: "2024-01-15", ... },
  content: "# Test\n\nContent here."
}

export const mockMultiplePosts = [
  { slug: "post-1", frontmatter: { date: "2024-01-15", ... }, content: "..." },
  { slug: "post-2", frontmatter: { date: "2024-01-10", ... }, content: "..." },
]
```

### Local Factory Helpers

For data needed only in one test file, use a local factory:

```typescript
const createPostFrontmatter = (overrides?: Partial<PostFrontmatter>): PostFrontmatter => ({
  title: "Test Post",
  excerpt: "Test excerpt",
  date: "2024-01-15",
  readingTime: "5 min read",
  tags: ["TypeScript"],
  ...overrides,
})
```

## Component Tests — React Testing Library

```typescript
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"
import { BlogCard } from "@/components/blog-card"

describe("BlogCard", () => {
  it("should display post title and excerpt", () => {
    render(<BlogCard post={mockPost} />)

    expect(screen.getByText(mockPost.title)).toBeInTheDocument()
    expect(screen.getByText(mockPost.excerpt)).toBeInTheDocument()
  })

  it("should navigate to post when clicked", async () => {
    const user = userEvent.setup()
    render(<BlogCard post={mockPost} />)

    await user.click(screen.getByRole("link"))

    // assert navigation or href
  })
})
```

## E2E Tests — Playwright

### Structure

```typescript
import { test, expect } from "@playwright/test"

test.describe("Blog Flow", () => {
  test("should display blog listing with articles", async ({ page }) => {
    await page.goto("/blog")

    await expect(page.locator("h1")).toContainText("Blog")
    const articles = page.locator("article")
    await expect(articles.first()).toBeVisible()
  })
})
```

### Selector Priority (best → worst)

1. `page.getByRole("button", { name: /Filtrar/i })` — semantic, accessible
2. `page.getByPlaceholder(/buscar/i)` — form elements
3. `page.getByText(/texto visible/i)` — visible text
4. `page.locator("[data-testid='...']")` — test IDs for complex cases
5. `page.locator(".class-name")` — CSS classes (last resort)

### Assertions

```typescript
// Prefer Playwright assertions (auto-wait)
await expect(page.locator("h1")).toContainText("Blog")
await expect(page.getByRole("article")).toBeVisible()

// For conditional checks (element may or may not appear)
const hasResults = await page.locator("article").first().isVisible().catch(() => false)
```

## Checklist

### Unit Tests
- [ ] `describe/it` structure — no standalone `test()`
- [ ] Names follow `should <describe behavior>` pattern
- [ ] Mock at the repository/port interface level
- [ ] Fixtures for shared mock data in `fixtures/` directory
- [ ] Local factory helpers for file-specific data
- [ ] No `any` in test files
- [ ] Import Vitest utilities: `import { describe, it, expect, vi } from "vitest"`

### Component Tests
- [ ] Use React Testing Library (`@testing-library/react`)
- [ ] Query by role, text, placeholder — not by CSS class
- [ ] Use `userEvent` for interactions, not `fireEvent`

### E2E Tests
- [ ] `test.describe` / `test` structure
- [ ] Use semantic selectors (role > text > placeholder > testId > CSS)
- [ ] Handle "may or may not appear" with `.catch(() => false)`
- [ ] Test complete user flows, not implementation details
