import { describe, it, expect, vi } from "vitest"
import { GetFeaturedProject } from "@/src/lib/content/application/use-cases/projects/GetFeaturedProject"
import type { ContentRepository } from "@/src/lib/content/domain/repositories/ContentRepository"
import { mockMultipleProjects, mockFeaturedProject } from "@fixtures/projects.fixtures"

describe("GetFeaturedProject", () => {
  it("should return first project with featured=true", async () => {
    const projectsWithFeatured = [...mockMultipleProjects, mockFeaturedProject]
    const mockRepo: ContentRepository = {
      readAll: vi.fn().mockResolvedValue(projectsWithFeatured),
      readBySlug: vi.fn(),
    }
    const useCase = new GetFeaturedProject(mockRepo)
    const project = await useCase.execute()

    expect(project?.slug).toBe("featured-project")
    expect(project?.featured).toBe(true)
  })

  it("should return first project when no featured projects exist", async () => {
    const mockRepo: ContentRepository = {
      readAll: vi.fn().mockResolvedValue(mockMultipleProjects),
      readBySlug: vi.fn(),
    }
    const useCase = new GetFeaturedProject(mockRepo)
    const project = await useCase.execute()

    expect(project?.slug).toBe("project-1") // First after sort by status (active)
  })

  it("should return null when no projects exist", async () => {
    const mockRepo: ContentRepository = {
      readAll: vi.fn().mockResolvedValue([]),
      readBySlug: vi.fn(),
    }
    const useCase = new GetFeaturedProject(mockRepo)
    const project = await useCase.execute()

    expect(project).toBeNull()
  })
})
