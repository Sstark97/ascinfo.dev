import { describe, it, expect, vi } from "vitest"
import { GetAllPosts } from "@/src/lib/content/application/use-cases/posts/GetAllPosts"
import type { ContentRepository } from "@/src/lib/content/domain/repositories/ContentRepository"
import { mockMultiplePosts } from "@fixtures/posts.fixtures"

describe("GetAllPosts", () => {
  it("should return all posts sorted by date (newest first)", async () => {
    const mockRepo: ContentRepository = {
      readAll: vi.fn().mockResolvedValue(mockMultiplePosts),
      readBySlug: vi.fn(),
    }
    const useCase = new GetAllPosts(mockRepo)
    const posts = await useCase.execute()

    expect(posts).toHaveLength(3)
    expect(posts[0].slug).toBe("post-3") // 2024-01-25
    expect(posts[1].slug).toBe("post-1") // 2024-01-20
    expect(posts[2].slug).toBe("post-2") // 2024-01-15
  })

  it("should return empty array when no posts exist", async () => {
    const mockRepo: ContentRepository = {
      readAll: vi.fn().mockResolvedValue([]),
      readBySlug: vi.fn(),
    }
    const useCase = new GetAllPosts(mockRepo)
    const posts = await useCase.execute()

    expect(posts).toEqual([])
  })
})
