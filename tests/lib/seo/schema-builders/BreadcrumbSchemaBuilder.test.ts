import { describe, it, expect } from "vitest"
import { BreadcrumbSchemaBuilder } from "@/src/lib/seo/schema-builders/BreadcrumbSchemaBuilder"
import { SCHEMA_CONTEXT, SITE_URL } from "@/src/lib/seo/constants"

describe("BreadcrumbSchemaBuilder", () => {
  describe("build() static method", () => {
    it("should create valid BreadcrumbList schema", () => {
      const items = [
        { name: "Home", item: "https://ascinfo.dev" },
        { name: "Blog", item: "https://ascinfo.dev/blog" },
        { name: "Post Title" },
      ]

      const schema = BreadcrumbSchemaBuilder.build(items)

      expect(schema["@context"]).toBe(SCHEMA_CONTEXT)
      expect(schema["@type"]).toBe("BreadcrumbList")
      expect(schema.itemListElement).toHaveLength(3)
    })

    it("should assign correct position to each breadcrumb item", () => {
      const items = [
        { name: "Home", item: "https://ascinfo.dev" },
        { name: "Blog", item: "https://ascinfo.dev/blog" },
        { name: "Post" },
      ]

      const schema = BreadcrumbSchemaBuilder.build(items)

      expect(schema.itemListElement[0].position).toBe(1)
      expect(schema.itemListElement[1].position).toBe(2)
      expect(schema.itemListElement[2].position).toBe(3)
    })

    it("should include item URL when provided", () => {
      const items = [
        { name: "Home", item: "https://ascinfo.dev" },
        { name: "Blog", item: "https://ascinfo.dev/blog" },
      ]

      const schema = BreadcrumbSchemaBuilder.build(items)

      expect(schema.itemListElement[0].item).toBe("https://ascinfo.dev")
      expect(schema.itemListElement[1].item).toBe("https://ascinfo.dev/blog")
    })

    it("should omit item URL for last breadcrumb (current page)", () => {
      const items = [
        { name: "Home", item: "https://ascinfo.dev" },
        { name: "Current Page" },
      ]

      const schema = BreadcrumbSchemaBuilder.build(items)

      expect(schema.itemListElement[0].item).toBe("https://ascinfo.dev")
      expect(schema.itemListElement[1].item).toBeUndefined()
    })

    it("should handle single breadcrumb item", () => {
      const items = [{ name: "Home" }]

      const schema = BreadcrumbSchemaBuilder.build(items)

      expect(schema.itemListElement).toHaveLength(1)
      expect(schema.itemListElement[0].name).toBe("Home")
      expect(schema.itemListElement[0].position).toBe(1)
    })

    it("should set correct @type for each ListItem", () => {
      const items = [
        { name: "Home", item: "https://ascinfo.dev" },
        { name: "Blog" },
      ]

      const schema = BreadcrumbSchemaBuilder.build(items)

      expect(schema.itemListElement[0]["@type"]).toBe("ListItem")
      expect(schema.itemListElement[1]["@type"]).toBe("ListItem")
    })
  })

  describe("forBlogPost()", () => {
    it("should create breadcrumb schema for blog post page", () => {
      const schema = BreadcrumbSchemaBuilder.forBlogPost("Test Post Title", "test-post-slug")

      expect(schema["@context"]).toBe(SCHEMA_CONTEXT)
      expect(schema["@type"]).toBe("BreadcrumbList")
      expect(schema.itemListElement).toHaveLength(3)
    })

    it("should have correct breadcrumb trail for blog post", () => {
      const schema = BreadcrumbSchemaBuilder.forBlogPost("Test Post", "test-post")

      expect(schema.itemListElement[0].name).toBe("Inicio")
      expect(schema.itemListElement[0].item).toBe(SITE_URL)

      expect(schema.itemListElement[1].name).toBe("Blog")
      expect(schema.itemListElement[1].item).toBe(`${SITE_URL}/blog`)

      expect(schema.itemListElement[2].name).toBe("Test Post")
      expect(schema.itemListElement[2].item).toBeUndefined()
    })

    it("should handle post titles with special characters", () => {
      const title = "Post with 'quotes' & special chars"
      const schema = BreadcrumbSchemaBuilder.forBlogPost(title, "test-slug")

      expect(schema.itemListElement[2].name).toBe(title)
    })
  })

  describe("forBlogListing()", () => {
    it("should create breadcrumb schema for blog listing page", () => {
      const schema = BreadcrumbSchemaBuilder.forBlogListing()

      expect(schema["@context"]).toBe(SCHEMA_CONTEXT)
      expect(schema["@type"]).toBe("BreadcrumbList")
      expect(schema.itemListElement).toHaveLength(2)
    })

    it("should have correct breadcrumb trail for blog listing", () => {
      const schema = BreadcrumbSchemaBuilder.forBlogListing()

      expect(schema.itemListElement[0].name).toBe("Inicio")
      expect(schema.itemListElement[0].item).toBe(SITE_URL)

      expect(schema.itemListElement[1].name).toBe("Blog")
      expect(schema.itemListElement[1].item).toBeUndefined()
    })
  })

  describe("forProject()", () => {
    it("should create breadcrumb schema for project page", () => {
      const schema = BreadcrumbSchemaBuilder.forProject("Project Name", "project-slug")

      expect(schema["@context"]).toBe(SCHEMA_CONTEXT)
      expect(schema["@type"]).toBe("BreadcrumbList")
      expect(schema.itemListElement).toHaveLength(3)
    })

    it("should have correct breadcrumb trail for project", () => {
      const schema = BreadcrumbSchemaBuilder.forProject("My Project", "my-project")

      expect(schema.itemListElement[0].name).toBe("Inicio")
      expect(schema.itemListElement[0].item).toBe(SITE_URL)

      expect(schema.itemListElement[1].name).toBe("Proyectos")
      expect(schema.itemListElement[1].item).toBe(`${SITE_URL}/proyectos`)

      expect(schema.itemListElement[2].name).toBe("My Project")
      expect(schema.itemListElement[2].item).toBeUndefined()
    })

    it("should accept slug parameter for future use", () => {
      // Even though slug is not currently used in the URL construction,
      // it's accepted as a parameter for potential future use
      const schema = BreadcrumbSchemaBuilder.forProject("Project", "project-slug")

      expect(schema.itemListElement).toHaveLength(3)
    })
  })

  describe("forProjectsListing()", () => {
    it("should create breadcrumb schema for projects listing page", () => {
      const schema = BreadcrumbSchemaBuilder.forProjectsListing()

      expect(schema["@context"]).toBe(SCHEMA_CONTEXT)
      expect(schema["@type"]).toBe("BreadcrumbList")
      expect(schema.itemListElement).toHaveLength(2)
    })

    it("should have correct breadcrumb trail for projects listing", () => {
      const schema = BreadcrumbSchemaBuilder.forProjectsListing()

      expect(schema.itemListElement[0].name).toBe("Inicio")
      expect(schema.itemListElement[0].item).toBe(SITE_URL)

      expect(schema.itemListElement[1].name).toBe("Proyectos")
      expect(schema.itemListElement[1].item).toBeUndefined()
    })
  })

  describe("forTalk()", () => {
    it("should create breadcrumb schema for talk page", () => {
      const schema = BreadcrumbSchemaBuilder.forTalk("Talk Title", "talk-slug")

      expect(schema["@context"]).toBe(SCHEMA_CONTEXT)
      expect(schema["@type"]).toBe("BreadcrumbList")
      expect(schema.itemListElement).toHaveLength(3)
    })

    it("should have correct breadcrumb trail for talk", () => {
      const schema = BreadcrumbSchemaBuilder.forTalk("My Talk", "my-talk")

      expect(schema.itemListElement[0].name).toBe("Inicio")
      expect(schema.itemListElement[0].item).toBe(SITE_URL)

      expect(schema.itemListElement[1].name).toBe("Charlas")
      expect(schema.itemListElement[1].item).toBe(`${SITE_URL}/charlas`)

      expect(schema.itemListElement[2].name).toBe("My Talk")
      expect(schema.itemListElement[2].item).toBeUndefined()
    })

    it("should accept slug parameter for future use", () => {
      const schema = BreadcrumbSchemaBuilder.forTalk("Talk", "talk-slug")

      expect(schema.itemListElement).toHaveLength(3)
    })
  })

  describe("forTalksListing()", () => {
    it("should create breadcrumb schema for talks listing page", () => {
      const schema = BreadcrumbSchemaBuilder.forTalksListing()

      expect(schema["@context"]).toBe(SCHEMA_CONTEXT)
      expect(schema["@type"]).toBe("BreadcrumbList")
      expect(schema.itemListElement).toHaveLength(2)
    })

    it("should have correct breadcrumb trail for talks listing", () => {
      const schema = BreadcrumbSchemaBuilder.forTalksListing()

      expect(schema.itemListElement[0].name).toBe("Inicio")
      expect(schema.itemListElement[0].item).toBe(SITE_URL)

      expect(schema.itemListElement[1].name).toBe("Charlas")
      expect(schema.itemListElement[1].item).toBeUndefined()
    })
  })

  describe("forAboutPage()", () => {
    it("should create breadcrumb schema for about page", () => {
      const schema = BreadcrumbSchemaBuilder.forAboutPage()

      expect(schema["@context"]).toBe(SCHEMA_CONTEXT)
      expect(schema["@type"]).toBe("BreadcrumbList")
      expect(schema.itemListElement).toHaveLength(2)
    })

    it("should have correct breadcrumb trail for about page", () => {
      const schema = BreadcrumbSchemaBuilder.forAboutPage()

      expect(schema.itemListElement[0].name).toBe("Inicio")
      expect(schema.itemListElement[0].item).toBe(SITE_URL)

      expect(schema.itemListElement[1].name).toBe("Sobre mí")
      expect(schema.itemListElement[1].item).toBeUndefined()
    })
  })

  describe("schema.org validation", () => {
    it("should have all required BreadcrumbList fields", () => {
      const schema = BreadcrumbSchemaBuilder.forBlogListing()

      expect(schema["@context"]).toBe("https://schema.org")
      expect(schema["@type"]).toBe("BreadcrumbList")
      expect(schema.itemListElement).toBeDefined()
      expect(Array.isArray(schema.itemListElement)).toBe(true)
    })

    it("should have all required ListItem fields", () => {
      const schema = BreadcrumbSchemaBuilder.forBlogPost("Test", "test")

      schema.itemListElement.forEach((item) => {
        expect(item["@type"]).toBe("ListItem")
        expect(item.position).toBeDefined()
        expect(typeof item.position).toBe("number")
        expect(item.name).toBeDefined()
        expect(typeof item.name).toBe("string")
      })
    })

    it("should have sequential positions starting from 1", () => {
      const schema = BreadcrumbSchemaBuilder.forBlogPost("Test", "test")

      schema.itemListElement.forEach((item, index) => {
        expect(item.position).toBe(index + 1)
      })
    })

    it("should validate against schema.org BreadcrumbList spec", () => {
      const schema = BreadcrumbSchemaBuilder.forBlogPost("Test Post", "test")

      // BreadcrumbList must have @context and @type
      expect(schema["@context"]).toBe("https://schema.org")
      expect(schema["@type"]).toBe("BreadcrumbList")

      // itemListElement must be an array of ListItem
      expect(Array.isArray(schema.itemListElement)).toBe(true)
      schema.itemListElement.forEach((item) => {
        expect(item["@type"]).toBe("ListItem")
        expect(typeof item.position).toBe("number")
        expect(typeof item.name).toBe("string")
      })
    })
  })

  describe("URL construction", () => {
    it("should use SITE_URL constant for base URLs", () => {
      const schema = BreadcrumbSchemaBuilder.forBlogPost("Test", "test")

      expect(schema.itemListElement[0].item).toBe(SITE_URL)
      expect(schema.itemListElement[1].item).toBe(`${SITE_URL}/blog`)
    })

    it("should construct correct URLs for all sections", () => {
      const blogSchema = BreadcrumbSchemaBuilder.forBlogPost("Post", "post")
      expect(blogSchema.itemListElement[1].item).toBe(`${SITE_URL}/blog`)

      const projectSchema = BreadcrumbSchemaBuilder.forProject("Project", "project")
      expect(projectSchema.itemListElement[1].item).toBe(`${SITE_URL}/proyectos`)

      const talkSchema = BreadcrumbSchemaBuilder.forTalk("Talk", "talk")
      expect(talkSchema.itemListElement[1].item).toBe(`${SITE_URL}/charlas`)
    })

    it("should not include URL for current page (last breadcrumb)", () => {
      const schemas = [
        BreadcrumbSchemaBuilder.forBlogListing(),
        BreadcrumbSchemaBuilder.forProjectsListing(),
        BreadcrumbSchemaBuilder.forTalksListing(),
        BreadcrumbSchemaBuilder.forAboutPage(),
        BreadcrumbSchemaBuilder.forBlogPost("Post", "post"),
        BreadcrumbSchemaBuilder.forProject("Project", "project"),
        BreadcrumbSchemaBuilder.forTalk("Talk", "talk"),
      ]

      schemas.forEach((schema) => {
        const lastItem = schema.itemListElement[schema.itemListElement.length - 1]
        expect(lastItem.item).toBeUndefined()
      })
    })
  })

  describe("consistency across methods", () => {
    it("should use 'Inicio' consistently for home breadcrumb", () => {
      const schemas = [
        BreadcrumbSchemaBuilder.forBlogListing(),
        BreadcrumbSchemaBuilder.forProjectsListing(),
        BreadcrumbSchemaBuilder.forTalksListing(),
        BreadcrumbSchemaBuilder.forAboutPage(),
        BreadcrumbSchemaBuilder.forBlogPost("Post", "post"),
      ]

      schemas.forEach((schema) => {
        expect(schema.itemListElement[0].name).toBe("Inicio")
      })
    })

    it("should always link home to SITE_URL", () => {
      const schemas = [
        BreadcrumbSchemaBuilder.forBlogListing(),
        BreadcrumbSchemaBuilder.forProjectsListing(),
        BreadcrumbSchemaBuilder.forTalksListing(),
        BreadcrumbSchemaBuilder.forAboutPage(),
        BreadcrumbSchemaBuilder.forBlogPost("Post", "post"),
      ]

      schemas.forEach((schema) => {
        expect(schema.itemListElement[0].item).toBe(SITE_URL)
      })
    })

    it("should follow same pattern for listing vs detail pages", () => {
      // Listing pages have 2 breadcrumbs
      const listingSchemas = [
        BreadcrumbSchemaBuilder.forBlogListing(),
        BreadcrumbSchemaBuilder.forProjectsListing(),
        BreadcrumbSchemaBuilder.forTalksListing(),
        BreadcrumbSchemaBuilder.forAboutPage(),
      ]

      listingSchemas.forEach((schema) => {
        expect(schema.itemListElement).toHaveLength(2)
      })

      // Detail pages have 3 breadcrumbs
      const detailSchemas = [
        BreadcrumbSchemaBuilder.forBlogPost("Post", "post"),
        BreadcrumbSchemaBuilder.forProject("Project", "project"),
        BreadcrumbSchemaBuilder.forTalk("Talk", "talk"),
      ]

      detailSchemas.forEach((schema) => {
        expect(schema.itemListElement).toHaveLength(3)
      })
    })
  })
})
