import { describe, it, expect } from "vitest"
import { BlogPostingSchemaBuilder } from "@/src/lib/seo/schema-builders/BlogPostingSchemaBuilder"
import { Post, type PostFrontmatter } from "@/content/domain/entities/Post"
import { SCHEMA_CONTEXT, SITE_URL, AUTHOR } from "@/src/lib/seo/constants"

describe("BlogPostingSchemaBuilder", () => {
  const createTestPost = (overrides?: Partial<PostFrontmatter>): Post => {
    const frontmatter: PostFrontmatter = {
      title: "Test Blog Post",
      excerpt: "This is a test blog post excerpt",
      date: "2024-01-15",
      readingTime: "5 min read",
      tags: ["TypeScript", "Testing", "SEO"],
      ...overrides,
    }

    return Post.create("test-blog-post", frontmatter, "Test content")
  }

  describe("build()", () => {
    it("should generate valid BlogPosting schema with basic fields", () => {
      const post = createTestPost()
      const schema = BlogPostingSchemaBuilder.build(post)

      expect(schema["@context"]).toBe(SCHEMA_CONTEXT)
      expect(schema["@type"]).toBe("BlogPosting")
      expect(schema.headline).toBe("Test Blog Post")
      expect(schema.description).toBe("This is a test blog post excerpt")
      expect(schema.datePublished).toBe("2024-01-15")
      expect(schema.keywords).toBe("TypeScript, Testing, SEO")
      expect(schema.articleSection).toBe("TypeScript")
      expect(schema.inLanguage).toBe("es-ES")
    })

    it("should use lastModified date when explicitly set", () => {
      const post = createTestPost({
        date: "2024-01-15",
        lastModified: "2024-02-10",
      })

      const schema = BlogPostingSchemaBuilder.build(post)

      expect(schema.datePublished).toBe("2024-01-15")
      expect(schema.dateModified).toBe("2024-02-10")
    })

    it("should fall back to publication date when lastModified is not set", () => {
      const post = createTestPost({
        date: "2024-01-15",
      })

      const schema = BlogPostingSchemaBuilder.build(post)

      expect(schema.datePublished).toBe("2024-01-15")
      expect(schema.dateModified).toBe("2024-01-15")
    })

    it("should include author information from constants", () => {
      const post = createTestPost()
      const schema = BlogPostingSchemaBuilder.build(post)

      expect(schema.author).toEqual({
        "@context": SCHEMA_CONTEXT,
        "@type": "Person",
        name: AUTHOR.name,
        url: AUTHOR.url,
      })
    })

    it("should include publisher information from constants", () => {
      const post = createTestPost()
      const schema = BlogPostingSchemaBuilder.build(post)

      expect(schema.publisher).toEqual({
        "@context": SCHEMA_CONTEXT,
        "@type": "Person",
        name: AUTHOR.name,
        url: AUTHOR.url,
        logo: {
          "@type": "ImageObject",
          url: AUTHOR.image,
        },
      })
    })

    it("should include mainEntityOfPage with correct URL", () => {
      const post = createTestPost()
      const schema = BlogPostingSchemaBuilder.build(post)

      expect(schema.mainEntityOfPage).toEqual({
        "@type": "WebPage",
        "@id": `${SITE_URL}/blog/test-blog-post`,
      })
    })

    it("should include author image", () => {
      const post = createTestPost()
      const schema = BlogPostingSchemaBuilder.build(post)

      expect(schema.image).toBe(AUTHOR.image)
    })

    it("should format keywords as comma-separated string", () => {
      const post = createTestPost({
        tags: ["TypeScript", "Testing", "SEO", "Next.js"],
      })

      const schema = BlogPostingSchemaBuilder.build(post)

      expect(schema.keywords).toBe("TypeScript, Testing, SEO, Next.js")
    })

    it("should use first tag as articleSection", () => {
      const post = createTestPost({
        tags: ["JavaScript", "React", "Testing"],
      })

      const schema = BlogPostingSchemaBuilder.build(post)

      expect(schema.articleSection).toBe("JavaScript")
    })

    it("should use 'Blog' as articleSection when no tags provided", () => {
      const post = createTestPost({
        tags: [],
      })

      const schema = BlogPostingSchemaBuilder.build(post)

      expect(schema.articleSection).toBe("Blog")
    })

    it("should handle single tag", () => {
      const post = createTestPost({
        tags: ["TypeScript"],
      })

      const schema = BlogPostingSchemaBuilder.build(post)

      expect(schema.keywords).toBe("TypeScript")
      expect(schema.articleSection).toBe("TypeScript")
    })
  })

  describe("schema.org validation", () => {
    it("should have all required BlogPosting fields", () => {
      const post = createTestPost()
      const schema = BlogPostingSchemaBuilder.build(post)

      // Required fields for BlogPosting according to schema.org
      expect(schema["@context"]).toBeDefined()
      expect(schema["@type"]).toBe("BlogPosting")
      expect(schema.headline).toBeDefined()
      expect(schema.datePublished).toBeDefined()
      expect(schema.author).toBeDefined()
    })

    it("should have recommended BlogPosting fields", () => {
      const post = createTestPost()
      const schema = BlogPostingSchemaBuilder.build(post)

      // Recommended fields for better SEO
      expect(schema.description).toBeDefined()
      expect(schema.dateModified).toBeDefined()
      expect(schema.image).toBeDefined()
      expect(schema.publisher).toBeDefined()
      expect(schema.mainEntityOfPage).toBeDefined()
    })

    it("should have correct @context URL", () => {
      const post = createTestPost()
      const schema = BlogPostingSchemaBuilder.build(post)

      expect(schema["@context"]).toBe("https://schema.org")
    })

    it("should have correct author @type", () => {
      const post = createTestPost()
      const schema = BlogPostingSchemaBuilder.build(post)

      expect(schema.author["@type"]).toBe("Person")
    })

    it("should have correct publisher @type", () => {
      const post = createTestPost()
      const schema = BlogPostingSchemaBuilder.build(post)

      expect(schema.publisher["@type"]).toBe("Person")
    })

    it("should have correct mainEntityOfPage @type", () => {
      const post = createTestPost()
      const schema = BlogPostingSchemaBuilder.build(post)

      expect(schema.mainEntityOfPage["@type"]).toBe("WebPage")
    })
  })

  describe("date handling edge cases", () => {
    it("should handle post modified on the same day as publication", () => {
      const sameDate = "2024-01-15"
      const post = createTestPost({
        date: sameDate,
        lastModified: sameDate,
      })

      const schema = BlogPostingSchemaBuilder.build(post)

      expect(schema.datePublished).toBe(sameDate)
      expect(schema.dateModified).toBe(sameDate)
    })

    it("should handle post modified multiple times (uses latest)", () => {
      const post = createTestPost({
        date: "2024-01-15",
        lastModified: "2024-03-20", // Latest modification
      })

      const schema = BlogPostingSchemaBuilder.build(post)

      expect(schema.datePublished).toBe("2024-01-15")
      expect(schema.dateModified).toBe("2024-03-20")
    })

    it("should handle ISO date formats", () => {
      const post = createTestPost({
        date: "2024-01-15T10:30:00Z",
        lastModified: "2024-02-10T14:45:00Z",
      })

      const schema = BlogPostingSchemaBuilder.build(post)

      expect(schema.datePublished).toBe("2024-01-15T10:30:00Z")
      expect(schema.dateModified).toBe("2024-02-10T14:45:00Z")
    })
  })

  describe("integration with Post entity", () => {
    it("should correctly use Post lastModified getter", () => {
      const post = createTestPost({
        date: "2024-01-15",
        lastModified: "2024-02-10",
      })

      // Verify Post entity returns correct lastModified
      expect(post.lastModified).toBe("2024-02-10")

      const schema = BlogPostingSchemaBuilder.build(post)

      // Verify schema uses Post's lastModified
      expect(schema.dateModified).toBe("2024-02-10")
    })

    it("should correctly use Post lastModified fallback", () => {
      const post = createTestPost({
        date: "2024-01-15",
        // No lastModified set
      })

      // Verify Post entity falls back to date
      expect(post.lastModified).toBe("2024-01-15")

      const schema = BlogPostingSchemaBuilder.build(post)

      // Verify schema uses Post's fallback
      expect(schema.dateModified).toBe("2024-01-15")
    })
  })

  describe("URL construction", () => {
    it("should construct correct blog post URL", () => {
      const post = Post.create(
        "my-awesome-post",
        {
          title: "My Awesome Post",
          excerpt: "Excerpt",
          date: "2024-01-15",
          readingTime: "5 min",
          tags: ["Test"],
        },
        "Content"
      )

      const schema = BlogPostingSchemaBuilder.build(post)

      expect(schema.mainEntityOfPage["@id"]).toBe(`${SITE_URL}/blog/my-awesome-post`)
    })

    it("should handle slugs with special characters", () => {
      const post = Post.create(
        "post-with-special-chars",
        {
          title: "Post with Special Chars",
          excerpt: "Excerpt",
          date: "2024-01-15",
          readingTime: "5 min",
          tags: ["Test"],
        },
        "Content"
      )

      const schema = BlogPostingSchemaBuilder.build(post)

      expect(schema.mainEntityOfPage["@id"]).toBe(
        `${SITE_URL}/blog/post-with-special-chars`
      )
    })
  })
})
