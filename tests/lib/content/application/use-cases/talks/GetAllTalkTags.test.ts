import { describe, it, expect, vi } from "vitest"
import { GetAllTalkTags } from "@/src/lib/content/application/use-cases/talks/GetAllTalkTags"
import type { ContentRepository, RawContent } from "@/src/lib/content/domain/repositories/ContentRepository"
import type { TalkFrontmatter } from "@/src/lib/content/domain/entities/Talk"
import { mockMultipleTalks } from "@fixtures/talks.fixtures"

describe("GetAllTalkTags", () => {
  it("should return unique tags sorted alphabetically", async () => {
    const mockRepo: ContentRepository = {
      readAll: vi.fn().mockResolvedValue(mockMultipleTalks),
      readBySlug: vi.fn(),
    }
    const useCase = new GetAllTalkTags(mockRepo)
    const tags = await useCase.execute()

    expect(tags).toEqual(["nextjs", "react", "testing", "typescript"])
  })

  it("should deduplicate tags", async () => {
    const duplicateTags = mockMultipleTalks.map((t: RawContent<TalkFrontmatter>) => ({
      ...t,
      frontmatter: { ...t.frontmatter, tags: ["react", "react", "typescript"] },
    }))
    const mockRepo: ContentRepository = {
      readAll: vi.fn().mockResolvedValue(duplicateTags),
      readBySlug: vi.fn(),
    }
    const useCase = new GetAllTalkTags(mockRepo)
    const tags = await useCase.execute()

    expect(tags).toEqual(["react", "typescript"])
  })
})
