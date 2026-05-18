import { describe, it, expect, vi, beforeEach } from "vitest"
import { NotionTestimonialRepository } from "@/content/infrastructure/notion/NotionTestimonialRepository"
import type { Client } from "@notionhq/client"

const makeFullPage = (properties: Record<string, unknown>): Record<string, unknown> => ({
  id: "page-1",
  object: "page",
  created_time: "2024-01-01T00:00:00.000Z",
  last_edited_time: "2024-01-01T00:00:00.000Z",
  created_by: { object: "user", id: "user-1" },
  last_edited_by: { object: "user", id: "user-1" },
  cover: null,
  icon: null,
  parent: { type: "database_id", database_id: "db-1" },
  archived: false,
  in_trash: false,
  url: "https://notion.so/page-1",
  public_url: null,
  properties,
})

const makeTestimonialProperties = (): Record<string, unknown> => ({
  Author: { type: "title", title: [{ plain_text: "Alice Example" }] },
  Slug: { type: "rich_text", rich_text: [{ plain_text: "alice-example" }] },
  Role: { type: "rich_text", rich_text: [{ plain_text: "Software Engineer" }] },
  Company: { type: "rich_text", rich_text: [{ plain_text: "Acme Corp" }] },
  Quote: { type: "rich_text", rich_text: [{ plain_text: "A great testimonial." }] },
  Locale: { type: "select", select: { name: "es" } },
  "LinkedIn URL": { type: "url", url: "https://www.linkedin.com/in/alice/" },
})

describe("NotionTestimonialRepository", () => {
  let mockNotionClient: { request: ReturnType<typeof vi.fn> }
  let repository: NotionTestimonialRepository

  beforeEach(() => {
    mockNotionClient = {
      request: vi.fn(),
    }
    repository = new NotionTestimonialRepository(
      mockNotionClient as unknown as Client,
      { testimonials: "testimonials-db-id" }
    )
  })

  describe("readAll()", () => {
    it("should query data_sources/<id>/query with a Locale select filter for the given locale", async () => {
      mockNotionClient.request.mockResolvedValue({ results: [] })

      await repository.readAll("es")

      expect(mockNotionClient.request).toHaveBeenCalledWith({
        path: "data_sources/testimonials-db-id/query",
        method: "post",
        body: {
          filter: { property: "Locale", select: { equals: "es" } },
        },
      })
    })

    it("should return testimonials mapped from Notion properties on the happy path", async () => {
      const page = makeFullPage(makeTestimonialProperties())
      mockNotionClient.request.mockResolvedValue({ results: [page] })

      const result = await repository.readAll("es")

      expect(result).toHaveLength(1)
      expect(result[0].slug).toBe("alice-example")
      expect(result[0].author).toBe("Alice Example")
      expect(result[0].role).toBe("Software Engineer")
      expect(result[0].company).toBe("Acme Corp")
      expect(result[0].quote).toBe("A great testimonial.")
      expect(result[0].linkedinUrl).toBe("https://www.linkedin.com/in/alice/")
    })

    it("should filter out pages without a Slug rich_text property", async () => {
      const properties = makeTestimonialProperties()
      delete (properties as Record<string, unknown>)["Slug"]
      const page = makeFullPage(properties)
      mockNotionClient.request.mockResolvedValue({ results: [page] })

      const result = await repository.readAll("es")

      expect(result).toHaveLength(0)
    })

    it("should filter out partial page objects where isFullPage returns false", async () => {
      const partialPage = { object: "page", id: "partial-1" }
      mockNotionClient.request.mockResolvedValue({ results: [partialPage] })

      const result = await repository.readAll("es")

      expect(result).toHaveLength(0)
    })

    it("should return an empty array on Notion API error", async () => {
      mockNotionClient.request.mockRejectedValue(new Error("Notion API error"))

      const result = await repository.readAll("es")

      expect(result).toEqual([])
    })
  })
})
