import type { ProjectDto } from "@/content/application/dto/ProjectDto"
import { PlainTextContent } from "../value-objects/PlainTextContent"
import { SeoMetadata } from "../value-objects/SeoMetadata"

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
  // SEO fields (opcionales)
  seoTitle?: string
  seoDescription?: string
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
    private readonly plainText: PlainTextContent,
    public readonly heroImage?: string,
    public readonly demoUrl?: string,
    public readonly featured?: boolean,
    public readonly stars?: number,
    public readonly forks?: number,
    public readonly lastCommit?: string,
    public readonly license?: string,
    private readonly seoMetadata?: SeoMetadata
  ) {}

  static create(slug: string, frontmatter: ProjectFrontmatter, content: string): Project {
    const seoMetadata = frontmatter.seoTitle ?? frontmatter.seoDescription
      ? SeoMetadata.create(
          frontmatter.seoTitle,
          frontmatter.seoDescription
        )
      : undefined

    return new Project(
      slug,
      frontmatter.title,
      frontmatter.description,
      frontmatter.tags,
      frontmatter.repoUrl,
      frontmatter.status,
      content,
      PlainTextContent.fromMarkdown(content),
      frontmatter.heroImage,
      frontmatter.demoUrl,
      frontmatter.featured,
      frontmatter.stars,
      frontmatter.forks,
      frontmatter.lastCommit,
      frontmatter.license,
      seoMetadata
    )
  }

  get plainTextContent(): string {
    return this.plainText.toString()
  }

  // Getters para SEO con fallback
  get metaTitle(): string {
    return this.seoMetadata?.title || this.title
  }

  get metaDescription(): string {
    return this.seoMetadata?.description || this.description
  }

  toDto(): ProjectDto {
    return {
      slug: this.slug,
      title: this.title,
      description: this.description,
      status: this.status,
      tags: this.tags,
      content: this.content,
      plainTextContent: this.plainText.toString(),
      featured: this.featured,
      repoUrl: this.repoUrl,
      demoUrl: this.demoUrl,
      stars: this.stars,
      forks: this.forks,
      lastCommit: this.lastCommit,
      // SEO fields
      metaTitle: this.metaTitle,
      metaDescription: this.metaDescription,
    }
  }
}
