import { describe, it, expect, vi } from "vitest"
import { GetFeaturedPosts } from "@/src/lib/content/application/use-cases/posts/GetFeaturedPosts"
import type { ContentRepository } from "@/src/lib/content/domain/repositories/ContentRepository"
import type { RawContent } from "@/src/lib/content/domain/repositories/ContentRepository"
import type { PostFrontmatter } from "@/src/lib/content/domain/entities/Post"
import { mockMultiplePosts, mockFeaturedPost } from "@fixtures/posts.fixtures"

const mockPostFrontmatter: PostFrontmatter = {
  title: "Test Post",
  excerpt: "Test excerpt",
  date: "2024-01-15",
  readingTime: "5 min",
  tags: ["typescript"],
  featured: false,
}

const createRawPost = (
  slug: string,
  overrides: Partial<PostFrontmatter> = {}
): RawContent<PostFrontmatter> => ({
  slug,
  frontmatter: { ...mockPostFrontmatter, ...overrides },
  content: `# ${slug}`,
})

describe("GetFeaturedPosts", () => {
  describe("execute()", () => {
    it("should return empty array when no posts exist", async () => {
      const mockRepo: ContentRepository = {
        readAll: vi.fn().mockResolvedValue([]),
        readBySlug: vi.fn(),
      }
      const useCase = new GetFeaturedPosts(mockRepo)

      const result = await useCase.execute("es", 4)

      expect(result).toEqual([])
    })

    it("should return empty array when limit is 0", async () => {
      const mockRepo: ContentRepository = {
        readAll: vi.fn().mockResolvedValue(mockMultiplePosts),
        readBySlug: vi.fn(),
      }
      const useCase = new GetFeaturedPosts(mockRepo)

      const result = await useCase.execute("es", 0)

      expect(result).toEqual([])
    })

    it("should return empty array when no posts have featured=true", async () => {
      const mockRepo: ContentRepository = {
        readAll: vi.fn().mockResolvedValue(mockMultiplePosts),
        readBySlug: vi.fn(),
      }
      const useCase = new GetFeaturedPosts(mockRepo)

      const result = await useCase.execute("es", 4)

      expect(result).toEqual([])
    })

    it("should return only featured posts up to limit when there are enough featured posts", async () => {
      const featuredPosts = [
        createRawPost("featured-1", { featured: true, date: "2024-03-01" }),
        createRawPost("featured-2", { featured: true, date: "2024-02-01" }),
        createRawPost("featured-3", { featured: true, date: "2024-01-01" }),
        createRawPost("not-featured-1", { featured: false, date: "2024-04-01" }),
      ]
      const mockRepo: ContentRepository = {
        readAll: vi.fn().mockResolvedValue(featuredPosts),
        readBySlug: vi.fn(),
      }
      const useCase = new GetFeaturedPosts(mockRepo)

      const result = await useCase.execute("es", 2)

      expect(result).toHaveLength(2)
      expect(result[0].slug).toBe("featured-1")
      expect(result[1].slug).toBe("featured-2")
      expect(result.every((post) => post.featured === true)).toBe(true)
    })

    it("should return all featured posts when fewer featured posts exist than limit", async () => {
      const posts = [
        createRawPost("featured-1", { featured: true, date: "2024-02-01" }),
        createRawPost("featured-2", { featured: true, date: "2024-01-01" }),
        createRawPost("not-featured-1", { featured: false, date: "2024-03-01" }),
        createRawPost("not-featured-2", { featured: false, date: "2024-04-01" }),
        createRawPost("not-featured-3", { featured: false, date: "2024-05-01" }),
      ]
      const mockRepo: ContentRepository = {
        readAll: vi.fn().mockResolvedValue(posts),
        readBySlug: vi.fn(),
      }
      const useCase = new GetFeaturedPosts(mockRepo)

      const result = await useCase.execute("es", 4)

      expect(result).toHaveLength(2)
      expect(result.every((post) => post.featured === true)).toBe(true)
    })

    it("should return all featured posts when limit exceeds total featured count", async () => {
      const postsWithFeatured = [...mockMultiplePosts, mockFeaturedPost]
      const mockRepo: ContentRepository = {
        readAll: vi.fn().mockResolvedValue(postsWithFeatured),
        readBySlug: vi.fn(),
      }
      const useCase = new GetFeaturedPosts(mockRepo)

      const result = await useCase.execute("es", 10)

      expect(result).toHaveLength(1)
      expect(result[0].slug).toBe("featured-post")
    })

    it("should preserve date descending order from GetAllPosts", async () => {
      const featuredPosts = [
        createRawPost("featured-old", { featured: true, date: "2024-01-01" }),
        createRawPost("featured-new", { featured: true, date: "2024-03-01" }),
        createRawPost("featured-mid", { featured: true, date: "2024-02-01" }),
      ]
      const mockRepo: ContentRepository = {
        readAll: vi.fn().mockResolvedValue(featuredPosts),
        readBySlug: vi.fn(),
      }
      const useCase = new GetFeaturedPosts(mockRepo)

      const result = await useCase.execute("es", 3)

      expect(result[0].slug).toBe("featured-new")
      expect(result[1].slug).toBe("featured-mid")
      expect(result[2].slug).toBe("featured-old")
    })

    it("should not include non-featured posts even when fewer featured than limit", async () => {
      const posts = [
        createRawPost("featured-only", { featured: true, date: "2024-03-01" }),
        createRawPost("non-featured-1", { featured: false, date: "2024-02-01" }),
        createRawPost("non-featured-2", { featured: false, date: "2024-01-01" }),
      ]
      const mockRepo: ContentRepository = {
        readAll: vi.fn().mockResolvedValue(posts),
        readBySlug: vi.fn(),
      }
      const useCase = new GetFeaturedPosts(mockRepo)

      const result = await useCase.execute("es", 4)

      expect(result).toHaveLength(1)
      expect(result[0].slug).toBe("featured-only")
      const slugs = result.map((post) => post.slug)
      expect(new Set(slugs).size).toBe(slugs.length)
    })
  })
})
