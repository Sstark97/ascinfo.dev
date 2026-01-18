import { describe, it, expect, vi } from "vitest"
import { GetAllProjects } from "@/src/lib/content/application/use-cases/projects/GetAllProjects"
import type { ContentRepository } from "@/src/lib/content/domain/repositories/ContentRepository"
import { mockMultipleProjects } from "@fixtures/projects.fixtures"

describe("GetAllProjects", () => {
  it("should return all projects sorted by status (active > maintenance > archived)", async () => {
    const mockRepo: ContentRepository = {
      readAll: vi.fn().mockResolvedValue(mockMultipleProjects),
      readBySlug: vi.fn(),
    }
    const useCase = new GetAllProjects(mockRepo)
    const projects = await useCase.execute()

    expect(projects).toHaveLength(3)
    expect(projects[0].status).toBe("active") // project-1
    expect(projects[1].status).toBe("maintenance") // project-3
    expect(projects[2].status).toBe("archived") // project-2
  })

  it("should return empty array when no projects exist", async () => {
    const mockRepo: ContentRepository = {
      readAll: vi.fn().mockResolvedValue([]),
      readBySlug: vi.fn(),
    }
    const useCase = new GetAllProjects(mockRepo)
    const projects = await useCase.execute()

    expect(projects).toEqual([])
  })
})
