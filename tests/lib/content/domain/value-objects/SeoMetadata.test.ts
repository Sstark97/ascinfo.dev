import { describe, it, expect } from "vitest"
import { SeoMetadata } from "@/content/domain/value-objects/SeoMetadata"

describe("SeoMetadata", () => {
  describe("when creating with valid data", () => {
    it("should preserve title and description when within limits", () => {
      const metadata = SeoMetadata.create(
        "Clean Code in React",
        "Learn how to write maintainable React components",
        "clean code react"
      )

      expect(metadata.title).toBe("Clean Code in React")
      expect(metadata.description).toBe("Learn how to write maintainable React components")
      expect(metadata.focusKeyword).toBe("clean code react")
    })

    it("should allow title up to 60 characters", () => {
      const title = "A".repeat(60)
      const metadata = SeoMetadata.create(title, "Description", "keyword")

      expect(metadata.title).toBe(title)
      expect(metadata.title.length).toBe(60)
    })

    it("should allow description up to 155 characters", () => {
      const description = "A".repeat(155)
      const metadata = SeoMetadata.create("Title", description, "keyword")

      expect(metadata.description).toBe(description)
      expect(metadata.description.length).toBe(155)
    })
  })

  describe("when title exceeds 60 characters", () => {
    it("should truncate and append ellipsis", () => {
      const longTitle = "This is a very long title that definitely exceeds the sixty character limit"
      const metadata = SeoMetadata.create(longTitle, "Description", "keyword")

      expect(metadata.title.length).toBeLessThanOrEqual(60)
      expect(metadata.title).toMatch(/\.\.\.$/)
    })

    it("should truncate at word boundary when possible", () => {
      const longTitle = "Clean Code Principles SOLID Architecture Design Patterns Best Practices"
      const metadata = SeoMetadata.create(longTitle, "Description", "keyword")

      expect(metadata.title.length).toBeLessThanOrEqual(60)
      expect(metadata.title).not.toMatch(/\s$/)
      expect(metadata.title).toMatch(/\.\.\.$/)
    })

    it("should not break in the middle of a word", () => {
      const longTitle = "Understanding TypeScript Generics and Advanced Type System Features"
      const metadata = SeoMetadata.create(longTitle, "Description", "keyword")

      expect(metadata.title.length).toBeLessThanOrEqual(60)
      expect(metadata.title).toMatch(/\.\.\.$/)
    })
  })

  describe("when description exceeds 155 characters", () => {
    it("should truncate and append ellipsis", () => {
      const longDescription =
        "This is a very long description that exceeds the one hundred fifty-five character limit and should be properly truncated with an ellipsis to maintain SEO best practices"
      const metadata = SeoMetadata.create("Title", longDescription, "keyword")

      expect(metadata.description.length).toBeLessThanOrEqual(155)
      expect(metadata.description).toMatch(/\.\.\.$/)
    })

    it("should truncate at word boundary when possible", () => {
      const longDescription =
        "Learn how to implement clean code principles in React applications with practical examples covering component composition hooks custom patterns and best practices for maintainable codebases"
      const metadata = SeoMetadata.create("Title", longDescription, "keyword")

      expect(metadata.description.length).toBeLessThanOrEqual(155)
      expect(metadata.description).not.toMatch(/\s$/)
      expect(metadata.description).toMatch(/\.\.\.$/)
    })
  })

  describe("when checking if metadata is empty", () => {
    it("should return true when all fields are empty", () => {
      const metadata = SeoMetadata.create("", "", "")

      expect(metadata.isEmpty()).toBe(true)
    })

    it("should return false when title is provided", () => {
      const metadata = SeoMetadata.create("Title", "", "")

      expect(metadata.isEmpty()).toBe(false)
    })

    it("should return false when description is provided", () => {
      const metadata = SeoMetadata.create("", "Description", "")

      expect(metadata.isEmpty()).toBe(false)
    })

    it("should return false when keyword is provided", () => {
      const metadata = SeoMetadata.create("", "", "keyword")

      expect(metadata.isEmpty()).toBe(false)
    })

    it("should return true when all fields including keyword are empty", () => {
      const metadata = SeoMetadata.create("", "", "")

      expect(metadata.isEmpty()).toBe(true)
    })
  })

  describe("when creating with undefined or null values", () => {
    it("should handle undefined values gracefully", () => {
      const metadata = SeoMetadata.create(undefined, undefined, undefined)

      expect(metadata.title).toBe("")
      expect(metadata.description).toBe("")
      expect(metadata.focusKeyword).toBeUndefined()
      expect(metadata.isEmpty()).toBe(true)
    })
  })
})
