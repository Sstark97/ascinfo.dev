import { describe, it, expect, vi } from "vitest"
import { GetPostBySlug } from "@/src/lib/content/application/use-cases/posts/GetPostBySlug"
import type { ContentRepository } from "@/src/lib/content/domain/repositories/ContentRepository"
import { mockRawPost } from "@fixtures/posts.fixtures"

describe("GetPostBySlug", () => {
  it("should return post when slug exists", async () => {
    const mockRepo: ContentRepository = {
      readAll: vi.fn(),
      readBySlug: vi.fn().mockResolvedValue(mockRawPost),
    }
    const useCase = new GetPostBySlug(mockRepo)
    const post = await useCase.execute("test-post")

    expect(post).not.toBeNull()
    expect(post?.slug).toBe("test-post")
    expect(post?.title).toBe("Test Post")
  })

  it("should return null when slug does not exist", async () => {
    const mockRepo: ContentRepository = {
      readAll: vi.fn(),
      readBySlug: vi.fn().mockResolvedValue(null),
    }
    const useCase = new GetPostBySlug(mockRepo)
    const post = await useCase.execute("non-existent")

    expect(post).toBeNull()
  })
})
