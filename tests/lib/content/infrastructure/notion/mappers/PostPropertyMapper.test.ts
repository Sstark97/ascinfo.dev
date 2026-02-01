import { describe, it, expect } from "vitest"
import { PostPropertyMapper } from "@/content/infrastructure/notion/mappers/PostPropertyMapper"
import type { NotionProperties } from "@/content/infrastructure/notion/types"

describe("PostPropertyMapper", () => {
  const mapper = new PostPropertyMapper()

  describe("mapToFrontmatter", () => {
    it("should map all required properties correctly", () => {
      const properties: NotionProperties = {
        Title: {
          type: "title",
          title: [{ plain_text: "Test Post Title" }],
        },
        Excerpt: {
          type: "rich_text",
          rich_text: [{ plain_text: "This is an excerpt" }],
        },
        Date: {
          type: "date",
          date: { start: "2024-01-15" },
        },
        "Reading Time": {
          type: "rich_text",
          rich_text: [{ plain_text: "5 min read" }],
        },
        Tags: {
          type: "multi_select",
          multi_select: [{ name: "TypeScript" }, { name: "Testing" }],
        },
      }

      const result = mapper.mapToFrontmatter(properties)

      expect(result).toEqual({
        title: "Test Post Title",
        excerpt: "This is an excerpt",
        date: "2024-01-15",
        readingTime: "5 min read",
        tags: ["TypeScript", "Testing"],
        featured: undefined,
      })
    })

    it("should handle featured checkbox when true", () => {
      const properties: NotionProperties = {
        Title: { type: "title", title: [{ plain_text: "Featured Post" }] },
        Excerpt: { type: "rich_text", rich_text: [{ plain_text: "Excerpt" }] },
        Date: { type: "date", date: { start: "2024-01-15" } },
        "Reading Time": { type: "rich_text", rich_text: [{ plain_text: "5 min" }] },
        Tags: { type: "multi_select", multi_select: [] },
        Featured: { type: "checkbox", checkbox: true },
      }

      const result = mapper.mapToFrontmatter(properties)

      expect(result.featured).toBe(true)
    })

    it("should handle featured checkbox when false", () => {
      const properties: NotionProperties = {
        Title: { type: "title", title: [{ plain_text: "Post" }] },
        Excerpt: { type: "rich_text", rich_text: [{ plain_text: "Excerpt" }] },
        Date: { type: "date", date: { start: "2024-01-15" } },
        "Reading Time": { type: "rich_text", rich_text: [{ plain_text: "5 min" }] },
        Tags: { type: "multi_select", multi_select: [] },
        Featured: { type: "checkbox", checkbox: false },
      }

      const result = mapper.mapToFrontmatter(properties)

      expect(result.featured).toBeUndefined()
    })

    it("should handle empty tags array", () => {
      const properties: NotionProperties = {
        Title: { type: "title", title: [{ plain_text: "Post" }] },
        Excerpt: { type: "rich_text", rich_text: [{ plain_text: "Excerpt" }] },
        Date: { type: "date", date: { start: "2024-01-15" } },
        "Reading Time": { type: "rich_text", rich_text: [{ plain_text: "5 min" }] },
        Tags: { type: "multi_select", multi_select: [] },
      }

      const result = mapper.mapToFrontmatter(properties)

      expect(result.tags).toEqual([])
    })

    it("should handle missing optional properties", () => {
      const properties: NotionProperties = {
        Title: { type: "title", title: [{ plain_text: "Post" }] },
        Excerpt: { type: "rich_text", rich_text: [{ plain_text: "Excerpt" }] },
        Date: { type: "date", date: { start: "2024-01-15" } },
        "Reading Time": { type: "rich_text", rich_text: [{ plain_text: "5 min" }] },
        Tags: { type: "multi_select", multi_select: [] },
      }

      const result = mapper.mapToFrontmatter(properties)

      expect(result.featured).toBeUndefined()
    })

    it("should handle empty title array", () => {
      const properties: NotionProperties = {
        Title: { type: "title", title: [] },
        Excerpt: { type: "rich_text", rich_text: [{ plain_text: "Excerpt" }] },
        Date: { type: "date", date: { start: "2024-01-15" } },
        "Reading Time": { type: "rich_text", rich_text: [{ plain_text: "5 min" }] },
        Tags: { type: "multi_select", multi_select: [] },
      }

      const result = mapper.mapToFrontmatter(properties)

      expect(result.title).toBe("")
    })

    it("should handle empty rich text arrays", () => {
      const properties: NotionProperties = {
        Title: { type: "title", title: [{ plain_text: "Post" }] },
        Excerpt: { type: "rich_text", rich_text: [] },
        Date: { type: "date", date: { start: "2024-01-15" } },
        "Reading Time": { type: "rich_text", rich_text: [] },
        Tags: { type: "multi_select", multi_select: [] },
      }

      const result = mapper.mapToFrontmatter(properties)

      expect(result.excerpt).toBe("")
      expect(result.readingTime).toBe("")
    })

    it("should handle null date", () => {
      const properties: NotionProperties = {
        Title: { type: "title", title: [{ plain_text: "Post" }] },
        Excerpt: { type: "rich_text", rich_text: [{ plain_text: "Excerpt" }] },
        Date: { type: "date", date: null },
        "Reading Time": { type: "rich_text", rich_text: [{ plain_text: "5 min" }] },
        Tags: { type: "multi_select", multi_select: [] },
      }

      const result = mapper.mapToFrontmatter(properties)

      expect(result.date).toBe("")
    })
  })
})
