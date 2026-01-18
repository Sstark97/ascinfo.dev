import { describe, it, expect, vi } from "vitest"
import { GetProjectBySlug } from "@/src/lib/content/application/use-cases/projects/GetProjectBySlug"
import type { ContentRepository } from "@/src/lib/content/domain/repositories/ContentRepository"
import { mockRawProject } from "@fixtures/projects.fixtures"

describe("GetProjectBySlug", () => {
  it("should return project when slug exists", async () => {
    const mockRepo: ContentRepository = {
      readAll: vi.fn(),
      readBySlug: vi.fn().mockResolvedValue(mockRawProject),
    }
    const useCase = new GetProjectBySlug(mockRepo)
    const project = await useCase.execute("test-project")

    expect(project).not.toBeNull()
    expect(project?.slug).toBe("test-project")
    expect(project?.title).toBe("Test Project")
  })

  it("should return null when slug does not exist", async () => {
    const mockRepo: ContentRepository = {
      readAll: vi.fn(),
      readBySlug: vi.fn().mockResolvedValue(null),
    }
    const useCase = new GetProjectBySlug(mockRepo)
    const project = await useCase.execute("non-existent")

    expect(project).toBeNull()
  })
})
