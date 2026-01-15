export type ProjectStatus = "active" | "maintenance" | "archived"

export type Project = {
  slug: string
  title: string
  description: string
  heroImage: string
  tags: string[]
  repoUrl: string
  demoUrl?: string
  status: ProjectStatus
  featured?: boolean
  stars?: number
  forks?: number
  lastCommit?: string
  license?: string
  content: string
}
