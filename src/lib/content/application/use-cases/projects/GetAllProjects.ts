import path from "path"
import { Project, ProjectFrontmatter } from "@/content/domain/entities/Project"
import type { ContentRepository } from "@/content/domain/repositories/ContentRepository"
import type { Locale } from "@/content/domain/types/Locale"

const PROJECTS_DIR = path.join(process.cwd(), "src/content/projects")

export class GetAllProjects {
  constructor(private readonly contentRepository: ContentRepository) {}

  async execute(locale: Locale): Promise<Project[]> {
    const rawProjects = await this.contentRepository.readAll<ProjectFrontmatter>(PROJECTS_DIR, locale)
    const projects = rawProjects.map(({ slug, frontmatter, content }) =>
      Project.create(slug, frontmatter, content)
    )
    const statusOrder = { active: 0, maintenance: 1, archived: 2 }
    return projects.sort((a, b) => statusOrder[a.status] - statusOrder[b.status])
  }
}
