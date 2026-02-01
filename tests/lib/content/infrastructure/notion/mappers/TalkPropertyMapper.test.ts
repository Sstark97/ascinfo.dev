import { describe, it, expect } from "vitest"
import { TalkPropertyMapper } from "@/content/infrastructure/notion/mappers/TalkPropertyMapper"
import type { NotionProperties } from "@/content/infrastructure/notion/types"

describe("TalkPropertyMapper", () => {
  const mapper = new TalkPropertyMapper()

  describe("mapToFrontmatter", () => {
    it("should map all properties correctly", () => {
      const properties: NotionProperties = {
        Title: { type: "title", title: [{ plain_text: "Test Talk" }] },
        Event: { type: "rich_text", rich_text: [{ plain_text: "Tech Conference 2024" }] },
        Date: { type: "date", date: { start: "2024-01-15" } },
        Location: { type: "rich_text", rich_text: [{ plain_text: "San Francisco, CA" }] },
        "Slides URL": { type: "url", url: "https://slides.com/talk" },
        "Video URL": { type: "url", url: "https://youtube.com/watch?v=123" },
        Tags: { type: "multi_select", multi_select: [{ name: "TypeScript" }, { name: "Architecture" }] },
        Featured: { type: "checkbox", checkbox: true },
        Description: { type: "rich_text", rich_text: [{ plain_text: "A talk about TypeScript" }] },
      }

      const result = mapper.mapToFrontmatter(properties)

      expect(result).toEqual({
        title: "Test Talk",
        event: "Tech Conference 2024",
        date: "2024-01-15",
        location: "San Francisco, CA",
        slidesUrl: "https://slides.com/talk",
        videoUrl: "https://youtube.com/watch?v=123",
        tags: ["TypeScript", "Architecture"],
        featured: true,
        description: "A talk about TypeScript",
      })
    })

    it("should handle missing optional properties", () => {
      const properties: NotionProperties = {
        Title: { type: "title", title: [{ plain_text: "Talk" }] },
        Event: { type: "rich_text", rich_text: [{ plain_text: "Event" }] },
        Date: { type: "date", date: { start: "2024-01-15" } },
        Location: { type: "rich_text", rich_text: [{ plain_text: "Location" }] },
        Tags: { type: "multi_select", multi_select: [] },
      }

      const result = mapper.mapToFrontmatter(properties)

      expect(result.slidesUrl).toBeUndefined()
      expect(result.videoUrl).toBeUndefined()
      expect(result.featured).toBeUndefined()
      expect(result.description).toBeUndefined()
    })

    it("should handle null URLs", () => {
      const properties: NotionProperties = {
        Title: { type: "title", title: [{ plain_text: "Talk" }] },
        Event: { type: "rich_text", rich_text: [{ plain_text: "Event" }] },
        Date: { type: "date", date: { start: "2024-01-15" } },
        Location: { type: "rich_text", rich_text: [{ plain_text: "Location" }] },
        Tags: { type: "multi_select", multi_select: [] },
        "Slides URL": { type: "url", url: null },
        "Video URL": { type: "url", url: null },
      }

      const result = mapper.mapToFrontmatter(properties)

      expect(result.slidesUrl).toBeUndefined()
      expect(result.videoUrl).toBeUndefined()
    })

    it("should handle featured false as undefined", () => {
      const properties: NotionProperties = {
        Title: { type: "title", title: [{ plain_text: "Talk" }] },
        Event: { type: "rich_text", rich_text: [{ plain_text: "Event" }] },
        Date: { type: "date", date: { start: "2024-01-15" } },
        Location: { type: "rich_text", rich_text: [{ plain_text: "Location" }] },
        Tags: { type: "multi_select", multi_select: [] },
        Featured: { type: "checkbox", checkbox: false },
      }

      const result = mapper.mapToFrontmatter(properties)

      expect(result.featured).toBeUndefined()
    })

    it("should handle empty description as undefined", () => {
      const properties: NotionProperties = {
        Title: { type: "title", title: [{ plain_text: "Talk" }] },
        Event: { type: "rich_text", rich_text: [{ plain_text: "Event" }] },
        Date: { type: "date", date: { start: "2024-01-15" } },
        Location: { type: "rich_text", rich_text: [{ plain_text: "Location" }] },
        Tags: { type: "multi_select", multi_select: [] },
        Description: { type: "rich_text", rich_text: [] },
      }

      const result = mapper.mapToFrontmatter(properties)

      expect(result.description).toBeUndefined()
    })

    it("should handle empty tags array", () => {
      const properties: NotionProperties = {
        Title: { type: "title", title: [{ plain_text: "Talk" }] },
        Event: { type: "rich_text", rich_text: [{ plain_text: "Event" }] },
        Date: { type: "date", date: { start: "2024-01-15" } },
        Location: { type: "rich_text", rich_text: [{ plain_text: "Location" }] },
        Tags: { type: "multi_select", multi_select: [] },
      }

      const result = mapper.mapToFrontmatter(properties)

      expect(result.tags).toEqual([])
    })

    it("should handle null date", () => {
      const properties: NotionProperties = {
        Title: { type: "title", title: [{ plain_text: "Talk" }] },
        Event: { type: "rich_text", rich_text: [{ plain_text: "Event" }] },
        Date: { type: "date", date: null },
        Location: { type: "rich_text", rich_text: [{ plain_text: "Location" }] },
        Tags: { type: "multi_select", multi_select: [] },
      }

      const result = mapper.mapToFrontmatter(properties)

      expect(result.date).toBe("")
    })

    it("should handle empty rich text arrays", () => {
      const properties: NotionProperties = {
        Title: { type: "title", title: [{ plain_text: "Talk" }] },
        Event: { type: "rich_text", rich_text: [] },
        Date: { type: "date", date: { start: "2024-01-15" } },
        Location: { type: "rich_text", rich_text: [] },
        Tags: { type: "multi_select", multi_select: [] },
      }

      const result = mapper.mapToFrontmatter(properties)

      expect(result.event).toBe("")
      expect(result.location).toBe("")
    })
  })
})
