import { describe, it, expect, vi, beforeEach } from "vitest"
import { NotionContentRepository } from "@/content/infrastructure/notion/NotionContentRepository"
import type { PostFrontmatter } from "@/content/domain/entities/Post"
import type { ProjectFrontmatter } from "@/content/domain/entities/Project"
import type { TalkFrontmatter } from "@/content/domain/entities/Talk"
import type { Client } from "@notionhq/client"

describe("NotionContentRepository", () => {
  let mockNotionClient: {
    request: ReturnType<typeof vi.fn>
    databases: {
      query: ReturnType<typeof vi.fn>
    }
    blocks: {
      children: {
        list: ReturnType<typeof vi.fn>
      }
    }
  }
  let repository: NotionContentRepository

  beforeEach(() => {
    mockNotionClient = {
      request: vi.fn(),
      databases: {
        query: vi.fn(),
      },
      blocks: {
        children: {
          list: vi.fn(),
        },
      },
    }

    repository = new NotionContentRepository(mockNotionClient as unknown as Client, {
      posts: "posts-db-id",
      projects: "projects-db-id",
      talks: "talks-db-id",
    })
  })

  describe("readAll", () => {
    it("should read all posts from Notion database", async () => {
      mockNotionClient.request.mockResolvedValue({
        results: [
          {
            id: "page-1",
            object: "page",
            properties: {
              Title: { type: "title", title: [{ plain_text: "Test Post" }] },
              Slug: { type: "rich_text", rich_text: [{ plain_text: "test-post" }] },
              Excerpt: { type: "rich_text", rich_text: [{ plain_text: "Test excerpt" }] },
              Date: { type: "date", date: { start: "2024-01-15" } },
              "Reading Time": { type: "rich_text", rich_text: [{ plain_text: "5 min" }] },
              Tags: { type: "multi_select", multi_select: [{ name: "TypeScript" }] },
            },
            created_time: "2024-01-01T00:00:00.000Z",
            last_edited_time: "2024-01-01T00:00:00.000Z",
          },
        ],
      })

      mockNotionClient.blocks.children.list.mockResolvedValue({
        results: [
          {
            object: "block",
            id: "block-1",
            type: "paragraph",
            paragraph: {
              rich_text: [{ type: "text", plain_text: "Test content", annotations: {} }],
              color: "default",
            },
            created_time: "2024-01-01T00:00:00.000Z",
            last_edited_time: "2024-01-01T00:00:00.000Z",
            created_by: { object: "user", id: "user-1" },
            last_edited_by: { object: "user", id: "user-1" },
            has_children: false,
            archived: false,
            in_trash: false,
            parent: { type: "page_id", page_id: "page-1" },
          },
        ],
        has_more: false,
      })

      const results = await repository.readAll<PostFrontmatter>("posts")

      expect(results).toHaveLength(1)
      expect(results[0].slug).toBe("test-post")
      expect(results[0].frontmatter.title).toBe("Test Post")
      expect(results[0].content).toContain("Test content")
      expect(mockNotionClient.request).toHaveBeenCalledWith({
        path: "data_sources/posts-db-id/query",
        method: "post",
        body: {
          filter: {
            property: "Status",
            select: { equals: "Published" },
          },
        },
      })
    })

    it("should read all projects from Notion database", async () => {
      mockNotionClient.request.mockResolvedValue({
        results: [
          {
            id: "page-1",
            object: "page",
            properties: {
              Title: { type: "title", title: [{ plain_text: "Test Project" }] },
              Slug: { type: "rich_text", rich_text: [{ plain_text: "test-project" }] },
              Description: { type: "rich_text", rich_text: [{ plain_text: "A test project" }] },
              Tags: { type: "multi_select", multi_select: [{ name: "React" }] },
              "Repo URL": { type: "url", url: "https://github.com/test/repo" },
              Status: { type: "select", select: { name: "active" } },
            },
            created_time: "2024-01-01T00:00:00.000Z",
            last_edited_time: "2024-01-01T00:00:00.000Z",
          },
        ],
      })

      mockNotionClient.blocks.children.list.mockResolvedValue({
        results: [],
        has_more: false,
      })

      const results = await repository.readAll<ProjectFrontmatter>("projects")

      expect(results).toHaveLength(1)
      expect(results[0].slug).toBe("test-project")
      expect(results[0].frontmatter.title).toBe("Test Project")
      expect(results[0].frontmatter.status).toBe("active")
    })

    it("should read all talks from Notion database", async () => {
      mockNotionClient.request.mockResolvedValue({
        results: [
          {
            id: "page-1",
            object: "page",
            properties: {
              Title: { type: "title", title: [{ plain_text: "Test Talk" }] },
              Slug: { type: "rich_text", rich_text: [{ plain_text: "test-talk" }] },
              Event: { type: "rich_text", rich_text: [{ plain_text: "Conference 2024" }] },
              Date: { type: "date", date: { start: "2024-01-15" } },
              Location: { type: "rich_text", rich_text: [{ plain_text: "SF" }] },
              Tags: { type: "multi_select", multi_select: [] },
            },
            created_time: "2024-01-01T00:00:00.000Z",
            last_edited_time: "2024-01-01T00:00:00.000Z",
          },
        ],
      })

      mockNotionClient.blocks.children.list.mockResolvedValue({
        results: [],
        has_more: false,
      })

      const results = await repository.readAll<TalkFrontmatter>("talks")

      expect(results).toHaveLength(1)
      expect(results[0].slug).toBe("test-talk")
      expect(results[0].frontmatter.title).toBe("Test Talk")
      expect(results[0].frontmatter.event).toBe("Conference 2024")
    })

    it("should return empty array for unknown directory", async () => {
      const results = await repository.readAll<PostFrontmatter>("unknown")

      expect(results).toEqual([])
      expect(mockNotionClient.request).not.toHaveBeenCalled()
    })

    it("should return empty array on API error", async () => {
      mockNotionClient.request.mockRejectedValue(new Error("API Error"))

      const results = await repository.readAll<PostFrontmatter>("posts")

      expect(results).toEqual([])
    })

    it("should handle directory path extraction", async () => {
      mockNotionClient.request.mockResolvedValue({ results: [] })

      await repository.readAll<PostFrontmatter>("src/content/posts")

      expect(mockNotionClient.request).toHaveBeenCalledWith({
        path: "data_sources/posts-db-id/query",
        method: "post",
        body: {
          filter: {
            property: "Status",
            select: { equals: "Published" },
          },
        },
      })
    })

    it("should filter out pages without slugs", async () => {
      mockNotionClient.request.mockResolvedValue({
        results: [
          {
            id: "page-1",
            object: "page",
            properties: {
              Title: { type: "title", title: [{ plain_text: "Test Post" }] },
              Slug: { type: "rich_text", rich_text: [] },
            },
            created_time: "2024-01-01T00:00:00.000Z",
            last_edited_time: "2024-01-01T00:00:00.000Z",
          },
        ],
      })

      const results = await repository.readAll<PostFrontmatter>("posts")

      expect(results).toEqual([])
    })

    it("should handle pagination when fetching blocks", async () => {
      mockNotionClient.request.mockResolvedValue({
        results: [
          {
            id: "page-1",
            object: "page",
            properties: {
              Title: { type: "title", title: [{ plain_text: "Test Post" }] },
              Slug: { type: "rich_text", rich_text: [{ plain_text: "test-post" }] },
              Excerpt: { type: "rich_text", rich_text: [{ plain_text: "Excerpt" }] },
              Date: { type: "date", date: { start: "2024-01-15" } },
              "Reading Time": { type: "rich_text", rich_text: [{ plain_text: "5 min" }] },
              Tags: { type: "multi_select", multi_select: [] },
            },
            created_time: "2024-01-01T00:00:00.000Z",
            last_edited_time: "2024-01-01T00:00:00.000Z",
          },
        ],
      })

      mockNotionClient.blocks.children.list
        .mockResolvedValueOnce({
          results: [
            {
              object: "block",
              id: "block-1",
              type: "paragraph",
              paragraph: {
                rich_text: [{ type: "text", plain_text: "First block", annotations: {} }],
                color: "default",
              },
              created_time: "2024-01-01T00:00:00.000Z",
              last_edited_time: "2024-01-01T00:00:00.000Z",
              created_by: { object: "user", id: "user-1" },
              last_edited_by: { object: "user", id: "user-1" },
              has_children: false,
              archived: false,
              in_trash: false,
              parent: { type: "page_id", page_id: "page-1" },
            },
          ],
          has_more: true,
          next_cursor: "cursor-1",
        })
        .mockResolvedValueOnce({
          results: [
            {
              object: "block",
              id: "block-2",
              type: "paragraph",
              paragraph: {
                rich_text: [{ type: "text", plain_text: "Second block", annotations: {} }],
                color: "default",
              },
              created_time: "2024-01-01T00:00:00.000Z",
              last_edited_time: "2024-01-01T00:00:00.000Z",
              created_by: { object: "user", id: "user-1" },
              last_edited_by: { object: "user", id: "user-1" },
              has_children: false,
              archived: false,
              in_trash: false,
              parent: { type: "page_id", page_id: "page-1" },
            },
          ],
          has_more: false,
        })

      const results = await repository.readAll<PostFrontmatter>("posts")

      expect(results).toHaveLength(1)
      expect(results[0].content).toContain("First block")
      expect(results[0].content).toContain("Second block")
      expect(mockNotionClient.blocks.children.list).toHaveBeenCalledTimes(2)
    })
  })

  describe("readBySlug", () => {
    it("should read a post by slug", async () => {
      mockNotionClient.request.mockResolvedValue({
        results: [
          {
            id: "page-1",
            object: "page",
            properties: {
              Title: { type: "title", title: [{ plain_text: "Test Post" }] },
              Slug: { type: "rich_text", rich_text: [{ plain_text: "test-post" }] },
              Excerpt: { type: "rich_text", rich_text: [{ plain_text: "Excerpt" }] },
              Date: { type: "date", date: { start: "2024-01-15" } },
              "Reading Time": { type: "rich_text", rich_text: [{ plain_text: "5 min" }] },
              Tags: { type: "multi_select", multi_select: [] },
            },
            created_time: "2024-01-01T00:00:00.000Z",
            last_edited_time: "2024-01-01T00:00:00.000Z",
          },
        ],
      })

      mockNotionClient.blocks.children.list.mockResolvedValue({
        results: [
          {
            object: "block",
            id: "block-1",
            type: "paragraph",
            paragraph: {
              rich_text: [{ type: "text", plain_text: "Content", annotations: {} }],
              color: "default",
            },
            created_time: "2024-01-01T00:00:00.000Z",
            last_edited_time: "2024-01-01T00:00:00.000Z",
            created_by: { object: "user", id: "user-1" },
            last_edited_by: { object: "user", id: "user-1" },
            has_children: false,
            archived: false,
            in_trash: false,
            parent: { type: "page_id", page_id: "page-1" },
          },
        ],
        has_more: false,
      })

      const result = await repository.readBySlug<PostFrontmatter>("posts", "test-post")

      expect(result).not.toBeNull()
      expect(result?.slug).toBe("test-post")
      expect(result?.frontmatter.title).toBe("Test Post")
      expect(mockNotionClient.request).toHaveBeenCalledWith({
        path: "data_sources/posts-db-id/query",
        method: "post",
        body: {
          filter: {
            and: [
              {
                property: "Slug",
                rich_text: { equals: "test-post" },
              },
              {
                property: "Status",
                select: { equals: "Published" },
              },
            ],
          },
        },
      })
    })

    it("should return null for non-existent slug", async () => {
      mockNotionClient.request.mockResolvedValue({
        results: [],
      })

      const result = await repository.readBySlug<PostFrontmatter>("posts", "non-existent")

      expect(result).toBeNull()
    })

    it("should return null for unknown directory", async () => {
      const result = await repository.readBySlug<PostFrontmatter>("unknown", "slug")

      expect(result).toBeNull()
      expect(mockNotionClient.request).not.toHaveBeenCalled()
    })

    it("should return null on API error", async () => {
      mockNotionClient.request.mockRejectedValue(new Error("API Error"))

      const result = await repository.readBySlug<PostFrontmatter>("posts", "test-post")

      expect(result).toBeNull()
    })
  })
})
