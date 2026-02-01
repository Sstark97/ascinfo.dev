import type { RawContent } from "@/content/domain/repositories/ContentRepository"
import type { ProjectFrontmatter } from "@/content/domain/entities/Project"

export const mockProjectFrontmatter: ProjectFrontmatter = {
  title: "Test Project",
  description: "Test project description",
  tags: ["typescript", "testing"],
  repoUrl: "https://github.com/test/project",
  status: "active",
  featured: false,
}

export const mockRawProject: RawContent<ProjectFrontmatter> = {
  slug: "test-project",
  frontmatter: mockProjectFrontmatter,
  content: "# Test Project Content",
}

export const mockFeaturedProject: RawContent<ProjectFrontmatter> = {
  slug: "featured-project",
  frontmatter: { ...mockProjectFrontmatter, featured: true },
  content: "# Featured Project Content",
}

export const mockMultipleProjects: RawContent<ProjectFrontmatter>[] = [
  {
    slug: "project-1",
    frontmatter: { ...mockProjectFrontmatter, status: "active", tags: ["react"] },
    content: "# Project 1",
  },
  {
    slug: "project-2",
    frontmatter: { ...mockProjectFrontmatter, status: "archived", tags: ["typescript", "nextjs"] },
    content: "# Project 2",
  },
  {
    slug: "project-3",
    frontmatter: { ...mockProjectFrontmatter, status: "maintenance", tags: ["testing"] },
    content: "# Project 3",
  },
]
