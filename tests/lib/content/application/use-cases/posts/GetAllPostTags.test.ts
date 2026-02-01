import { describe, it, expect, vi } from "vitest"
import { GetAllPostTags } from "@/src/lib/content/application/use-cases/posts/GetAllPostTags"
import type { ContentRepository, RawContent } from "@/src/lib/content/domain/repositories/ContentRepository"
import type { PostFrontmatter } from "@/src/lib/content/domain/entities/Post"
import { mockMultiplePosts } from "@fixtures/posts.fixtures"

describe("GetAllPostTags", () => {
  it("should return unique tags sorted alphabetically", async () => {
    const mockRepo: ContentRepository = {
      readAll: vi.fn().mockResolvedValue(mockMultiplePosts),
      readBySlug: vi.fn(),
    }
    const useCase = new GetAllPostTags(mockRepo)
    const tags = await useCase.execute()

    expect(tags).toEqual(["nextjs", "react", "testing", "typescript"])
  })

  it("should deduplicate tags", async () => {
    const duplicateTags = mockMultiplePosts.map((p: RawContent<PostFrontmatter>) => ({
      ...p,
      frontmatter: { ...p.frontmatter, tags: ["react", "react", "typescript"] },
    }))
    const mockRepo: ContentRepository = {
      readAll: vi.fn().mockResolvedValue(duplicateTags),
      readBySlug: vi.fn(),
    }
    const useCase = new GetAllPostTags(mockRepo)
    const tags = await useCase.execute()

    expect(tags).toEqual(["react", "typescript"])
  })
})
