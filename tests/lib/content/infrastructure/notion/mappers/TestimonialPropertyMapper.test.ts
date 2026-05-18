import { describe, it, expect } from "vitest"
import { TestimonialPropertyMapper } from "@/content/infrastructure/notion/mappers/TestimonialPropertyMapper"
import type { NotionProperties } from "@/content/infrastructure/notion/types"

const makeProperties = (overrides: Partial<NotionProperties> = {}): NotionProperties =>
  ({
    Author: { type: "title", title: [{ plain_text: "Alice Example" }] },
    Slug: { type: "rich_text", rich_text: [{ plain_text: "alice-example" }] },
    Role: { type: "rich_text", rich_text: [{ plain_text: "Software Engineer" }] },
    Company: { type: "rich_text", rich_text: [{ plain_text: "Acme Corp" }] },
    Quote: { type: "rich_text", rich_text: [{ plain_text: "A great testimonial." }] },
    Locale: { type: "select", select: { name: "es" } },
    "LinkedIn URL": { type: "url", url: "https://www.linkedin.com/in/alice/" },
    ...overrides,
  }) as NotionProperties

describe("TestimonialPropertyMapper", () => {
  const mapper = new TestimonialPropertyMapper()

  describe("mapToFrontmatter()", () => {
    it("should map all required properties correctly", () => {
      const properties = makeProperties()

      const frontmatter = mapper.mapToFrontmatter(properties)

      expect(frontmatter.author).toBe("Alice Example")
      expect(frontmatter.role).toBe("Software Engineer")
      expect(frontmatter.company).toBe("Acme Corp")
      expect(frontmatter.quote).toBe("A great testimonial.")
      expect(frontmatter.locale).toBe("es")
      expect(frontmatter.linkedinUrl).toBe("https://www.linkedin.com/in/alice/")
    })

    it("should set avatarUrl to undefined when Avatar Path is missing", () => {
      const properties = makeProperties()

      const frontmatter = mapper.mapToFrontmatter(properties)

      expect(frontmatter.avatarUrl).toBeUndefined()
    })

    it("should set avatarUrl to undefined when Avatar Path is empty rich_text", () => {
      const properties = makeProperties({
        "Avatar Path": { type: "rich_text", rich_text: [] } as unknown as NotionProperties[string],
      })

      const frontmatter = mapper.mapToFrontmatter(properties)

      expect(frontmatter.avatarUrl).toBeUndefined()
    })

    it("should set avatarUrl when Avatar Path has a value", () => {
      const properties = makeProperties({
        "Avatar Path": {
          type: "rich_text",
          rich_text: [{ plain_text: "/testimonials/alice.jpg" }],
        } as unknown as NotionProperties[string],
      })

      const frontmatter = mapper.mapToFrontmatter(properties)

      expect(frontmatter.avatarUrl).toBe("/testimonials/alice.jpg")
    })

    it("should resolve locale to 'en' when the Locale select is en", () => {
      const properties = makeProperties({
        Locale: { type: "select", select: { name: "en" } } as unknown as NotionProperties[string],
      })

      const frontmatter = mapper.mapToFrontmatter(properties)

      expect(frontmatter.locale).toBe("en")
    })

    it("should default locale to 'es' when the Locale select is missing or null", () => {
      const properties = makeProperties({
        Locale: { type: "select", select: null } as unknown as NotionProperties[string],
      })

      const frontmatter = mapper.mapToFrontmatter(properties)

      expect(frontmatter.locale).toBe("es")
    })

    it("should fall back to empty string for LinkedIn URL when the url property is null", () => {
      const properties = makeProperties({
        "LinkedIn URL": { type: "url", url: null } as unknown as NotionProperties[string],
      })

      const frontmatter = mapper.mapToFrontmatter(properties)

      expect(frontmatter.linkedinUrl).toBe("")
    })
  })

  describe("extractSlug()", () => {
    it("should return the slug from the Slug rich_text property", () => {
      const properties = makeProperties()

      const slug = mapper.extractSlug(properties)

      expect(slug).toBe("alice-example")
    })

    it("should return undefined when the Slug property is missing", () => {
      const properties = makeProperties({ Slug: undefined as unknown as NotionProperties[string] })

      const slug = mapper.extractSlug(properties)

      expect(slug).toBeUndefined()
    })

    it("should return undefined when the Slug rich_text array is empty", () => {
      const properties = makeProperties({
        Slug: { type: "rich_text", rich_text: [] } as unknown as NotionProperties[string],
      })

      const slug = mapper.extractSlug(properties)

      expect(slug).toBeUndefined()
    })
  })
})
