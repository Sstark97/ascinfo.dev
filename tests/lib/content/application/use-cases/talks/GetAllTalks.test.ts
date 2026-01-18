import { describe, it, expect, vi } from "vitest"
import { GetAllTalks } from "@/src/lib/content/application/use-cases/talks/GetAllTalks"
import type { ContentRepository } from "@/src/lib/content/domain/repositories/ContentRepository"
import { mockMultipleTalks } from "@fixtures/talks.fixtures"

describe("GetAllTalks", () => {
  it("should return all talks sorted by date (newest first)", async () => {
    const mockRepo: ContentRepository = {
      readAll: vi.fn().mockResolvedValue(mockMultipleTalks),
      readBySlug: vi.fn(),
    }
    const useCase = new GetAllTalks(mockRepo)
    const talks = await useCase.execute()

    expect(talks).toHaveLength(3)
    expect(talks[0].slug).toBe("talk-3") // 2024-01-25
    expect(talks[1].slug).toBe("talk-1") // 2024-01-20
    expect(talks[2].slug).toBe("talk-2") // 2024-01-15
  })

  it("should return empty array when no talks exist", async () => {
    const mockRepo: ContentRepository = {
      readAll: vi.fn().mockResolvedValue([]),
      readBySlug: vi.fn(),
    }
    const useCase = new GetAllTalks(mockRepo)
    const talks = await useCase.execute()

    expect(talks).toEqual([])
  })
})
