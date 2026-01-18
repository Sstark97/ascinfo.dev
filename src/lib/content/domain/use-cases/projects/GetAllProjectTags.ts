import { GetAllProjects } from "./GetAllProjects"
import type { ContentRepository } from "../../repositories/ContentRepository"

export class GetAllProjectTags {
  private readonly getAllProjects: GetAllProjects

  constructor(contentRepository: ContentRepository) {
    this.getAllProjects = new GetAllProjects(contentRepository)
  }

  async execute(): Promise<string[]> {
    const projects = await this.getAllProjects.execute()
    const tagsSet = new Set<string>()
    projects.forEach((project) => project.tags.forEach((tag) => tagsSet.add(tag)))
    return Array.from(tagsSet).sort()
  }
}
