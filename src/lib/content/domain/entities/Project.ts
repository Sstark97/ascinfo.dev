import type { ProjectDto } from "@/content/application/dto/ProjectDto"

export type ProjectStatus = "active" | "maintenance" | "archived"

export type ProjectFrontmatter = {
  title: string
  description: string
  heroImage?: string
  tags: string[]
  repoUrl: string
  demoUrl?: string
  status: ProjectStatus
  featured?: boolean
  stars?: number
  forks?: number
  lastCommit?: string
  license?: string
}

export class Project {
  constructor(
    public readonly slug: string,
    public readonly title: string,
    public readonly description: string,
    public readonly tags: string[],
    public readonly repoUrl: string,
    public readonly status: ProjectStatus,
    public readonly content: string,
    public readonly heroImage?: string,
    public readonly demoUrl?: string,
    public readonly featured?: boolean,
    public readonly stars?: number,
    public readonly forks?: number,
    public readonly lastCommit?: string,
    public readonly license?: string
  ) {}

  static create(slug: string, frontmatter: ProjectFrontmatter, content: string): Project {
    return new Project(
      slug,
      frontmatter.title,
      frontmatter.description,
      frontmatter.tags,
      frontmatter.repoUrl,
      frontmatter.status,
      content,
      frontmatter.heroImage,
      frontmatter.demoUrl,
      frontmatter.featured,
      frontmatter.stars,
      frontmatter.forks,
      frontmatter.lastCommit,
      frontmatter.license
    )
  }

  toDto(): ProjectDto {
    return {
      slug: this.slug,
      title: this.title,
      description: this.description,
      status: this.status,
      tags: this.tags,
      content: this.content,
      featured: this.featured,
      repoUrl: this.repoUrl,
      demoUrl: this.demoUrl,
      stars: this.stars,
      forks: this.forks,
      lastCommit: this.lastCommit,
    }
  }
}
