import { describe, it, expect } from "vitest"
import { Post, type PostFrontmatter } from "@/content/domain/entities/Post"

describe("Post Entity", () => {
  const createPostFrontmatter = (overrides?: Partial<PostFrontmatter>): PostFrontmatter => ({
    title: "Test Post",
    excerpt: "Test excerpt for the post",
    date: "2024-01-15",
    readingTime: "5 min read",
    tags: ["TypeScript", "Testing"],
    featured: false,
    ...overrides,
  })

  describe("create() static method", () => {
    it("should create a Post instance from frontmatter and content", () => {
      const frontmatter = createPostFrontmatter()
      const content = "# Test Post\n\nThis is test content."

      const post = Post.create("test-post", frontmatter, content)

      expect(post).toBeInstanceOf(Post)
      expect(post.slug).toBe("test-post")
      expect(post.title).toBe("Test Post")
      expect(post.excerpt).toBe("Test excerpt for the post")
      expect(post.date).toBe("2024-01-15")
      expect(post.readingTime).toBe("5 min read")
      expect(post.tags).toEqual(["TypeScript", "Testing"])
      expect(post.content).toBe(content)
      expect(post.featured).toBe(false)
    })

    it("should handle post with lastModified field", () => {
      const frontmatter = createPostFrontmatter({
        date: "2024-01-15",
        lastModified: "2024-02-10",
      })

      const post = Post.create("test-post", frontmatter, "Content")

      expect(post.date).toBe("2024-01-15")
      expect(post.lastModified).toBe("2024-02-10")
    })

    it("should handle post without lastModified field", () => {
      const frontmatter = createPostFrontmatter({
        date: "2024-01-15",
      })

      const post = Post.create("test-post", frontmatter, "Content")

      expect(post.date).toBe("2024-01-15")
      expect(post.lastModified).toBe("2024-01-15") // Falls back to date
    })

    it("should create post with SEO metadata when provided", () => {
      const frontmatter = createPostFrontmatter({
        seoTitle: "Custom SEO Title",
        seoDescription: "Custom SEO description",
        focusKeyword: "test keyword",
      })

      const post = Post.create("test-post", frontmatter, "Content")

      expect(post.metaTitle).toBe("Custom SEO Title")
      expect(post.metaDescription).toBe("Custom SEO description")
      expect(post.focusKeyword).toBe("test keyword")
    })

    it("should create post without SEO metadata when not provided", () => {
      const frontmatter = createPostFrontmatter()

      const post = Post.create("test-post", frontmatter, "Content")

      // Should fall back to default title and excerpt
      expect(post.metaTitle).toBe("Test Post")
      expect(post.metaDescription).toBe("Test excerpt for the post")
      expect(post.focusKeyword).toBeUndefined()
    })

    it("should handle featured posts", () => {
      const frontmatter = createPostFrontmatter({ featured: true })

      const post = Post.create("test-post", frontmatter, "Content")

      expect(post.featured).toBe(true)
    })
  })

  describe("lastModified getter", () => {
    it("should return lastModified when explicitly set", () => {
      const frontmatter = createPostFrontmatter({
        date: "2024-01-15",
        lastModified: "2024-02-10",
      })

      const post = Post.create("test-post", frontmatter, "Content")

      expect(post.lastModified).toBe("2024-02-10")
    })

    it("should fall back to date when lastModified is not set", () => {
      const frontmatter = createPostFrontmatter({
        date: "2024-01-15",
      })

      const post = Post.create("test-post", frontmatter, "Content")

      expect(post.lastModified).toBe("2024-01-15")
    })

    it("should fall back to date when lastModified is undefined", () => {
      const frontmatter = createPostFrontmatter({
        date: "2024-01-15",
        lastModified: undefined,
      })

      const post = Post.create("test-post", frontmatter, "Content")

      expect(post.lastModified).toBe("2024-01-15")
    })
  })

  describe("toDto() method", () => {
    it("should convert Post to DTO with all fields", () => {
      const frontmatter = createPostFrontmatter({
        date: "2024-01-15",
        lastModified: "2024-02-10",
        seoTitle: "SEO Title",
        seoDescription: "SEO Description",
        focusKeyword: "keyword",
      })

      const post = Post.create("test-post", frontmatter, "# Content\n\nTest content.")

      const dto = post.toDto()

      expect(dto).toEqual({
        slug: "test-post",
        title: "Test Post",
        excerpt: "Test excerpt for the post",
        date: "2024-01-15",
        lastModified: "2024-02-10",
        readingTime: "5 min read",
        tags: ["TypeScript", "Testing"],
        content: "# Content\n\nTest content.",
        plainTextContent: expect.any(String),
        featured: false,
        metaTitle: "SEO Title",
        metaDescription: "SEO Description",
        focusKeyword: "keyword",
      })
    })

    it("should include lastModified in DTO even when falling back to date", () => {
      const frontmatter = createPostFrontmatter({
        date: "2024-01-15",
      })

      const post = Post.create("test-post", frontmatter, "Content")

      const dto = post.toDto()

      expect(dto.date).toBe("2024-01-15")
      expect(dto.lastModified).toBe("2024-01-15")
    })

    it("should include SEO metadata in DTO with fallbacks", () => {
      const frontmatter = createPostFrontmatter()

      const post = Post.create("test-post", frontmatter, "Content")

      const dto = post.toDto()

      expect(dto.metaTitle).toBe("Test Post") // Falls back to title
      expect(dto.metaDescription).toBe("Test excerpt for the post") // Falls back to excerpt
      expect(dto.focusKeyword).toBeUndefined()
    })

    it("should include plain text content in DTO", () => {
      const markdown = "# Heading\n\nThis is **bold** text."
      const post = Post.create("test-post", createPostFrontmatter(), markdown)

      const dto = post.toDto()

      expect(dto.plainTextContent).toBeDefined()
      expect(typeof dto.plainTextContent).toBe("string")
      expect(dto.plainTextContent.length).toBeGreaterThan(0)
    })
  })

  describe("plainTextContent getter", () => {
    it("should extract plain text from markdown content", () => {
      const markdown = "# Heading\n\nThis is **bold** and *italic* text."
      const post = Post.create("test-post", createPostFrontmatter(), markdown)

      const plainText = post.plainTextContent

      expect(plainText).toBeDefined()
      expect(typeof plainText).toBe("string")
    })
  })

  describe("SEO getters", () => {
    it("should return custom SEO title when provided", () => {
      const frontmatter = createPostFrontmatter({
        seoTitle: "Custom SEO Title",
      })

      const post = Post.create("test-post", frontmatter, "Content")

      expect(post.metaTitle).toBe("Custom SEO Title")
    })

    it("should fall back to title when SEO title is not provided", () => {
      const frontmatter = createPostFrontmatter()

      const post = Post.create("test-post", frontmatter, "Content")

      expect(post.metaTitle).toBe("Test Post")
    })

    it("should return custom SEO description when provided", () => {
      const frontmatter = createPostFrontmatter({
        seoDescription: "Custom SEO Description",
      })

      const post = Post.create("test-post", frontmatter, "Content")

      expect(post.metaDescription).toBe("Custom SEO Description")
    })

    it("should fall back to excerpt when SEO description is not provided", () => {
      const frontmatter = createPostFrontmatter()

      const post = Post.create("test-post", frontmatter, "Content")

      expect(post.metaDescription).toBe("Test excerpt for the post")
    })

    it("should return focus keyword when provided with SEO metadata", () => {
      const frontmatter = createPostFrontmatter({
        seoTitle: "SEO Title",
        focusKeyword: "test keyword",
      })

      const post = Post.create("test-post", frontmatter, "Content")

      expect(post.focusKeyword).toBe("test keyword")
    })

    it("should return undefined for focus keyword when not provided", () => {
      const frontmatter = createPostFrontmatter()

      const post = Post.create("test-post", frontmatter, "Content")

      expect(post.focusKeyword).toBeUndefined()
    })
  })

  describe("backward compatibility", () => {
    it("should work with posts that only have required fields", () => {
      const minimalFrontmatter: PostFrontmatter = {
        title: "Minimal Post",
        excerpt: "Minimal excerpt",
        date: "2024-01-15",
        readingTime: "3 min read",
        tags: ["Test"],
      }

      const post = Post.create("minimal-post", minimalFrontmatter, "Content")

      expect(post.slug).toBe("minimal-post")
      expect(post.title).toBe("Minimal Post")
      expect(post.lastModified).toBe("2024-01-15") // Falls back to date
      expect(post.featured).toBeUndefined()
      expect(post.metaTitle).toBe("Minimal Post")
      expect(post.metaDescription).toBe("Minimal excerpt")
    })

    it("should not break existing posts without lastModified field", () => {
      const legacyFrontmatter: PostFrontmatter = {
        title: "Legacy Post",
        excerpt: "Legacy excerpt",
        date: "2023-12-01",
        readingTime: "4 min read",
        tags: ["Legacy"],
      }

      const post = Post.create("legacy-post", legacyFrontmatter, "Legacy content")

      const dto = post.toDto()

      expect(dto.date).toBe("2023-12-01")
      expect(dto.lastModified).toBe("2023-12-01") // Falls back to date
      expect(() => post.lastModified).not.toThrow()
    })
  })
})
