import { Project } from "../../../domain/entities/Project"
import { GetAllProjects } from "./GetAllProjects"
import type { ContentRepository } from "../../../domain/repositories/ContentRepository"

export class GetFeaturedProject {
  private readonly getAllProjects: GetAllProjects

  constructor(contentRepository: ContentRepository) {
    this.getAllProjects = new GetAllProjects(contentRepository)
  }

  async execute(): Promise<Project | null> {
    const projects = await this.getAllProjects.execute()
    const featured = projects.find((project) => project.featured)
    return featured ?? projects[0] ?? null
  }
}
