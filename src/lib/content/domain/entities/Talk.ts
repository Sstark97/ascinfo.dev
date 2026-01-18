import type { TalkDto } from "../../application/dto/TalkDto"

export type TalkFrontmatter = {
  title: string
  event: string
  date: string
  location: string
  slidesUrl?: string
  videoUrl?: string
  tags: string[]
  featured?: boolean
  description?: string
}

export class Talk {
  constructor(
    public readonly slug: string,
    public readonly title: string,
    public readonly event: string,
    public readonly date: string,
    public readonly location: string,
    public readonly tags: string[],
    public readonly content: string,
    public readonly slidesUrl?: string,
    public readonly videoUrl?: string,
    public readonly featured?: boolean,
    public readonly description?: string
  ) {}

  static create(slug: string, frontmatter: TalkFrontmatter, content: string): Talk {
    return new Talk(
      slug,
      frontmatter.title,
      frontmatter.event,
      frontmatter.date,
      frontmatter.location,
      frontmatter.tags,
      content,
      frontmatter.slidesUrl,
      frontmatter.videoUrl,
      frontmatter.featured,
      frontmatter.description
    )
  }

  toDto(): TalkDto {
    return {
      slug: this.slug,
      title: this.title,
      description: this.description ?? "",
      date: this.date,
      event: this.event,
      location: this.location,
      tags: this.tags,
      content: this.content,
      featured: this.featured,
      slidesUrl: this.slidesUrl,
      videoUrl: this.videoUrl,
    }
  }
}
