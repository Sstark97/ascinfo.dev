import path from "path"
import { Project, ProjectFrontmatter } from "../../entities/Project"
import type { ContentRepository } from "../../repositories/ContentRepository"

const PROJECTS_DIR = path.join(process.cwd(), "src/content/projects")

export class GetAllProjects {
  constructor(private readonly contentRepository: ContentRepository) {}

  async execute(): Promise<Project[]> {
    const rawProjects = await this.contentRepository.readAll<ProjectFrontmatter>(PROJECTS_DIR)
    const projects = rawProjects.map(({ slug, frontmatter, content }) =>
      Project.create(slug, frontmatter, content)
    )
    const statusOrder = { active: 0, maintenance: 1, archived: 2 }
    return projects.sort((a, b) => statusOrder[a.status] - statusOrder[b.status])
  }
}
