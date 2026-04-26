import path from "path"
import { Project, ProjectFrontmatter } from "@/content/domain/entities/Project"
import type { ContentRepository } from "@/content/domain/repositories/ContentRepository"
import type { Locale } from "@/content/domain/types/Locale"

const PROJECTS_DIR = path.join(process.cwd(), "src/content/projects")

export class GetProjectBySlug {
  constructor(private readonly contentRepository: ContentRepository) {}

  async execute(slug: string, locale: Locale): Promise<Project | null> {
    const raw = await this.contentRepository.readBySlug<ProjectFrontmatter>(PROJECTS_DIR, locale, slug)
    if (!raw) return null
    return Project.create(raw.slug, raw.frontmatter, raw.content)
  }
}
