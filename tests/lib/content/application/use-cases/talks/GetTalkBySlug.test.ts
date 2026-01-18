import { describe, it, expect, vi } from "vitest"
import { GetTalkBySlug } from "@/src/lib/content/application/use-cases/talks/GetTalkBySlug"
import type { ContentRepository } from "@/src/lib/content/domain/repositories/ContentRepository"
import { mockRawTalk } from "@fixtures/talks.fixtures"

describe("GetTalkBySlug", () => {
  it("should return talk when slug exists", async () => {
    const mockRepo: ContentRepository = {
      readAll: vi.fn(),
      readBySlug: vi.fn().mockResolvedValue(mockRawTalk),
    }
    const useCase = new GetTalkBySlug(mockRepo)
    const talk = await useCase.execute("test-talk")

    expect(talk).not.toBeNull()
    expect(talk?.slug).toBe("test-talk")
    expect(talk?.title).toBe("Test Talk")
  })

  it("should return null when slug does not exist", async () => {
    const mockRepo: ContentRepository = {
      readAll: vi.fn(),
      readBySlug: vi.fn().mockResolvedValue(null),
    }
    const useCase = new GetTalkBySlug(mockRepo)
    const talk = await useCase.execute("non-existent")

    expect(talk).toBeNull()
  })
})
