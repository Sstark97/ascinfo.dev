import { describe, it, expect, vi } from "vitest"
import { GetFeaturedTalk } from "@/src/lib/content/application/use-cases/talks/GetFeaturedTalk"
import type { ContentRepository } from "@/src/lib/content/domain/repositories/ContentRepository"
import { mockMultipleTalks, mockFeaturedTalk } from "@fixtures/talks.fixtures"

describe("GetFeaturedTalk", () => {
  it("should return first talk with featured=true", async () => {
    const talksWithFeatured = [...mockMultipleTalks, mockFeaturedTalk]
    const mockRepo: ContentRepository = {
      readAll: vi.fn().mockResolvedValue(talksWithFeatured),
      readBySlug: vi.fn(),
    }
    const useCase = new GetFeaturedTalk(mockRepo)
    const talk = await useCase.execute()

    expect(talk?.slug).toBe("featured-talk")
    expect(talk?.featured).toBe(true)
  })

  it("should return first talk when no featured talks exist", async () => {
    const mockRepo: ContentRepository = {
      readAll: vi.fn().mockResolvedValue(mockMultipleTalks),
      readBySlug: vi.fn(),
    }
    const useCase = new GetFeaturedTalk(mockRepo)
    const talk = await useCase.execute()

    expect(talk?.slug).toBe("talk-3") // First after sort by date (newest: 2024-01-25)
  })

  it("should return null when no talks exist", async () => {
    const mockRepo: ContentRepository = {
      readAll: vi.fn().mockResolvedValue([]),
      readBySlug: vi.fn(),
    }
    const useCase = new GetFeaturedTalk(mockRepo)
    const talk = await useCase.execute()

    expect(talk).toBeNull()
  })
})
