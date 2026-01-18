import { describe, it, expect, vi } from "vitest"
import { GetFeaturedPost } from "@/src/lib/content/application/use-cases/posts/GetFeaturedPost"
import type { ContentRepository } from "@/src/lib/content/domain/repositories/ContentRepository"
import { mockMultiplePosts, mockFeaturedPost } from "@fixtures/posts.fixtures"

describe("GetFeaturedPost", () => {
  it("should return first post with featured=true", async () => {
    const postsWithFeatured = [...mockMultiplePosts, mockFeaturedPost]
    const mockRepo: ContentRepository = {
      readAll: vi.fn().mockResolvedValue(postsWithFeatured),
      readBySlug: vi.fn(),
    }
    const useCase = new GetFeaturedPost(mockRepo)
    const post = await useCase.execute()

    expect(post?.slug).toBe("featured-post")
    expect(post?.featured).toBe(true)
  })

  it("should return first post when no featured posts exist", async () => {
    const mockRepo: ContentRepository = {
      readAll: vi.fn().mockResolvedValue(mockMultiplePosts),
      readBySlug: vi.fn(),
    }
    const useCase = new GetFeaturedPost(mockRepo)
    const post = await useCase.execute()

    expect(post?.slug).toBe("post-3") // First after sort by date
  })

  it("should return null when no posts exist", async () => {
    const mockRepo: ContentRepository = {
      readAll: vi.fn().mockResolvedValue([]),
      readBySlug: vi.fn(),
    }
    const useCase = new GetFeaturedPost(mockRepo)
    const post = await useCase.execute()

    expect(post).toBeNull()
  })
})
