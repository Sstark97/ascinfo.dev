import type { ProjectStatus } from "../../domain/entities/Project"

export type ProjectDto = {
  slug: string
  title: string
  description: string
  status: ProjectStatus
  tags: string[]
  content: string
  featured?: boolean
  repoUrl: string
  demoUrl?: string
  stars?: number
  forks?: number
  lastCommit?: string
}
