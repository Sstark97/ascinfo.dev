import path from "path"
import { Project, ProjectFrontmatter } from "../../../domain/entities/Project"
import type { ContentRepository } from "../../../domain/repositories/ContentRepository"

const PROJECTS_DIR = path.join(process.cwd(), "src/content/projects")

export class GetProjectBySlug {
  constructor(private readonly contentRepository: ContentRepository) {}

  async execute(slug: string): Promise<Project | null> {
    const raw = await this.contentRepository.readBySlug<ProjectFrontmatter>(PROJECTS_DIR, slug)
    if (!raw) return null
    return Project.create(raw.slug, raw.frontmatter, raw.content)
  }
}
