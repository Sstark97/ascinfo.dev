import { describe, it, expect, vi } from "vitest"
import { GetAllProjectTags } from "@/src/lib/content/application/use-cases/projects/GetAllProjectTags"
import type { ContentRepository, RawContent } from "@/src/lib/content/domain/repositories/ContentRepository"
import type { ProjectFrontmatter } from "@/src/lib/content/domain/entities/Project"
import { mockMultipleProjects } from "@fixtures/projects.fixtures"

describe("GetAllProjectTags", () => {
  it("should return unique tags sorted alphabetically", async () => {
    const mockRepo: ContentRepository = {
      readAll: vi.fn().mockResolvedValue(mockMultipleProjects),
      readBySlug: vi.fn(),
    }
    const useCase = new GetAllProjectTags(mockRepo)
    const tags = await useCase.execute()

    expect(tags).toEqual(["nextjs", "react", "testing", "typescript"])
  })

  it("should deduplicate tags", async () => {
    const duplicateTags = mockMultipleProjects.map((p: RawContent<ProjectFrontmatter>) => ({
      ...p,
      frontmatter: { ...p.frontmatter, tags: ["react", "react", "typescript"] },
    }))
    const mockRepo: ContentRepository = {
      readAll: vi.fn().mockResolvedValue(duplicateTags),
      readBySlug: vi.fn(),
    }
    const useCase = new GetAllProjectTags(mockRepo)
    const tags = await useCase.execute()

    expect(tags).toEqual(["react", "typescript"])
  })
})
