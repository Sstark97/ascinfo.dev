import type { TalkDto } from "@/content/application/dto/TalkDto"
import { PlainTextContent } from "../value-objects/PlainTextContent"
import { SeoMetadata } from "../value-objects/SeoMetadata"

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
  // SEO fields (opcionales)
  seoTitle?: string
  seoDescription?: string
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
    private readonly plainText: PlainTextContent,
    public readonly slidesUrl?: string,
    public readonly videoUrl?: string,
    public readonly featured?: boolean,
    public readonly description?: string,
    private readonly seoMetadata?: SeoMetadata
  ) {}

  static create(slug: string, frontmatter: TalkFrontmatter, content: string): Talk {
    const seoMetadata = frontmatter.seoTitle ?? frontmatter.seoDescription
      ? SeoMetadata.create(
          frontmatter.seoTitle,
          frontmatter.seoDescription
        )
      : undefined

    return new Talk(
      slug,
      frontmatter.title,
      frontmatter.event,
      frontmatter.date,
      frontmatter.location,
      frontmatter.tags,
      content,
      PlainTextContent.fromMarkdown(content),
      frontmatter.slidesUrl,
      frontmatter.videoUrl,
      frontmatter.featured,
      frontmatter.description,
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
    return this.seoMetadata?.description || this.description || ''
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
      plainTextContent: this.plainText.toString(),
      featured: this.featured,
      slidesUrl: this.slidesUrl,
      videoUrl: this.videoUrl,
      // SEO fields
      metaTitle: this.metaTitle,
      metaDescription: this.metaDescription,
    }
  }
}
