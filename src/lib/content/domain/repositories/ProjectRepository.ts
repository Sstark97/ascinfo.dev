import type { Project } from "../entities/Project"

export type ProjectRepository = {
  getAll(): Promise<Project[]>
  getBySlug(slug: string): Promise<Project | null>
  getAllTags(): Promise<string[]>
  getFeatured(): Promise<Project | null>
}
