import { describe, it, expect } from "vitest"
import { ProjectPropertyMapper } from "@/content/infrastructure/notion/mappers/ProjectPropertyMapper"
import type { NotionProperties } from "@/content/infrastructure/notion/types"

describe("ProjectPropertyMapper", () => {
  const mapper = new ProjectPropertyMapper()

  describe("mapToFrontmatter", () => {
    it("should map all properties correctly", () => {
      const properties: NotionProperties = {
        Title: { type: "title", title: [{ plain_text: "Test Project" }] },
        Description: { type: "rich_text", rich_text: [{ plain_text: "A test project" }] },
        "Hero Image": { type: "url", url: "https://example.com/hero.png" },
        Tags: { type: "multi_select", multi_select: [{ name: "TypeScript" }, { name: "React" }] },
        "Repo URL": { type: "url", url: "https://github.com/user/repo" },
        "Demo URL": { type: "url", url: "https://demo.com" },
        Status: { type: "select", select: { name: "active" } },
        Featured: { type: "checkbox", checkbox: true },
        Stars: { type: "number", number: 100 },
        Forks: { type: "number", number: 25 },
        "Last Commit": { type: "date", date: { start: "2024-01-15" } },
        License: { type: "rich_text", rich_text: [{ plain_text: "MIT" }] },
      }

      const result = mapper.mapToFrontmatter(properties)

      expect(result).toEqual({
        title: "Test Project",
        description: "A test project",
        heroImage: "https://example.com/hero.png",
        tags: ["TypeScript", "React"],
        repoUrl: "https://github.com/user/repo",
        demoUrl: "https://demo.com",
        status: "active",
        featured: true,
        stars: 100,
        forks: 25,
        lastCommit: "2024-01-15",
        license: "MIT",
      })
    })

    it("should handle status: maintenance", () => {
      const properties: NotionProperties = {
        Title: { type: "title", title: [{ plain_text: "Project" }] },
        Description: { type: "rich_text", rich_text: [{ plain_text: "Description" }] },
        Tags: { type: "multi_select", multi_select: [] },
        "Repo URL": { type: "url", url: "https://github.com/user/repo" },
        Status: { type: "select", select: { name: "maintenance" } },
      }

      const result = mapper.mapToFrontmatter(properties)

      expect(result.status).toBe("maintenance")
    })

    it("should handle status: archived", () => {
      const properties: NotionProperties = {
        Title: { type: "title", title: [{ plain_text: "Project" }] },
        Description: { type: "rich_text", rich_text: [{ plain_text: "Description" }] },
        Tags: { type: "multi_select", multi_select: [] },
        "Repo URL": { type: "url", url: "https://github.com/user/repo" },
        Status: { type: "select", select: { name: "archived" } },
      }

      const result = mapper.mapToFrontmatter(properties)

      expect(result.status).toBe("archived")
    })

    it("should default to active for invalid status", () => {
      const properties: NotionProperties = {
        Title: { type: "title", title: [{ plain_text: "Project" }] },
        Description: { type: "rich_text", rich_text: [{ plain_text: "Description" }] },
        Tags: { type: "multi_select", multi_select: [] },
        "Repo URL": { type: "url", url: "https://github.com/user/repo" },
        Status: { type: "select", select: { name: "invalid" } },
      }

      const result = mapper.mapToFrontmatter(properties)

      expect(result.status).toBe("active")
    })

    it("should handle missing optional properties", () => {
      const properties: NotionProperties = {
        Title: { type: "title", title: [{ plain_text: "Project" }] },
        Description: { type: "rich_text", rich_text: [{ plain_text: "Description" }] },
        Tags: { type: "multi_select", multi_select: [] },
        "Repo URL": { type: "url", url: "https://github.com/user/repo" },
        Status: { type: "select", select: { name: "active" } },
      }

      const result = mapper.mapToFrontmatter(properties)

      expect(result.heroImage).toBeUndefined()
      expect(result.demoUrl).toBeUndefined()
      expect(result.featured).toBeUndefined()
      expect(result.stars).toBeUndefined()
      expect(result.forks).toBeUndefined()
      expect(result.lastCommit).toBeUndefined()
      expect(result.license).toBeUndefined()
    })

    it("should handle null URLs", () => {
      const properties: NotionProperties = {
        Title: { type: "title", title: [{ plain_text: "Project" }] },
        Description: { type: "rich_text", rich_text: [{ plain_text: "Description" }] },
        Tags: { type: "multi_select", multi_select: [] },
        "Repo URL": { type: "url", url: null },
        "Demo URL": { type: "url", url: null },
        Status: { type: "select", select: { name: "active" } },
      }

      const result = mapper.mapToFrontmatter(properties)

      expect(result.repoUrl).toBe("")
      expect(result.demoUrl).toBeUndefined()
    })

    it("should handle null numbers", () => {
      const properties: NotionProperties = {
        Title: { type: "title", title: [{ plain_text: "Project" }] },
        Description: { type: "rich_text", rich_text: [{ plain_text: "Description" }] },
        Tags: { type: "multi_select", multi_select: [] },
        "Repo URL": { type: "url", url: "https://github.com/user/repo" },
        Status: { type: "select", select: { name: "active" } },
        Stars: { type: "number", number: null },
        Forks: { type: "number", number: null },
      }

      const result = mapper.mapToFrontmatter(properties)

      expect(result.stars).toBeUndefined()
      expect(result.forks).toBeUndefined()
    })

    it("should handle featured false as undefined", () => {
      const properties: NotionProperties = {
        Title: { type: "title", title: [{ plain_text: "Project" }] },
        Description: { type: "rich_text", rich_text: [{ plain_text: "Description" }] },
        Tags: { type: "multi_select", multi_select: [] },
        "Repo URL": { type: "url", url: "https://github.com/user/repo" },
        Status: { type: "select", select: { name: "active" } },
        Featured: { type: "checkbox", checkbox: false },
      }

      const result = mapper.mapToFrontmatter(properties)

      expect(result.featured).toBeUndefined()
    })

    it("should handle empty license as undefined", () => {
      const properties: NotionProperties = {
        Title: { type: "title", title: [{ plain_text: "Project" }] },
        Description: { type: "rich_text", rich_text: [{ plain_text: "Description" }] },
        Tags: { type: "multi_select", multi_select: [] },
        "Repo URL": { type: "url", url: "https://github.com/user/repo" },
        Status: { type: "select", select: { name: "active" } },
        License: { type: "rich_text", rich_text: [] },
      }

      const result = mapper.mapToFrontmatter(properties)

      expect(result.license).toBeUndefined()
    })
  })

  describe("with SEO properties", () => {
    it("should map SEO title, description and keyword when provided", () => {
      const properties: NotionProperties = {
        Title: { type: "title", title: [{ plain_text: "DevSweep" }] },
        Description: { type: "rich_text", rich_text: [{ plain_text: "CLI tool" }] },
        Tags: { type: "multi_select", multi_select: [] },
        "Repo URL": { type: "url", url: "https://github.com/user/repo" },
        Status: { type: "select", select: { name: "active" } },
        "SEO Title": { type: "rich_text", rich_text: [{ plain_text: "DevSweep: Clean Caches - Aitor Santana" }] },
        "SEO Description": { type: "rich_text", rich_text: [{ plain_text: "Professional CLI tool by Aitor Santana to recover disk space." }] },
        "Focus Keyword": { type: "rich_text", rich_text: [{ plain_text: "devsweep cli aitor santana" }] },
      }

      const result = mapper.mapToFrontmatter(properties)

      expect(result.seoTitle).toBe("DevSweep: Clean Caches - Aitor Santana")
      expect(result.seoDescription).toBe("Professional CLI tool by Aitor Santana to recover disk space.")
      expect(result.focusKeyword).toBe("devsweep cli aitor santana")
    })

    it("should handle missing SEO properties gracefully", () => {
      const properties: NotionProperties = {
        Title: { type: "title", title: [{ plain_text: "Project" }] },
        Description: { type: "rich_text", rich_text: [{ plain_text: "Description" }] },
        Tags: { type: "multi_select", multi_select: [] },
        "Repo URL": { type: "url", url: "https://github.com/user/repo" },
        Status: { type: "select", select: { name: "active" } },
      }

      const result = mapper.mapToFrontmatter(properties)

      expect(result.seoTitle).toBeUndefined()
      expect(result.seoDescription).toBeUndefined()
      expect(result.focusKeyword).toBeUndefined()
    })
  })
})
