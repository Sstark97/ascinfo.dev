import type { PostDto } from "@/content/application/dto/PostDto"
import { PlainTextContent } from "../value-objects/PlainTextContent"
import { SeoMetadata } from "../value-objects/SeoMetadata"

export type PostFrontmatter = {
  title: string
  excerpt: string
  date: string
  readingTime: string
  tags: string[]
  featured?: boolean
  // SEO fields (opcionales)
  seoTitle?: string
  seoDescription?: string
  focusKeyword?: string
}

export class Post {
  constructor(
    public readonly slug: string,
    public readonly title: string,
    public readonly excerpt: string,
    public readonly date: string,
    public readonly readingTime: string,
    public readonly tags: string[],
    public readonly content: string,
    private readonly plainText: PlainTextContent,
    public readonly featured?: boolean,
    private readonly seoMetadata?: SeoMetadata
  ) {}

  static create(slug: string, frontmatter: PostFrontmatter, content: string): Post {
    const seoMetadata = frontmatter.seoTitle ?? frontmatter.seoDescription
      ? SeoMetadata.create(
          frontmatter.seoTitle,
          frontmatter.seoDescription,
          frontmatter.focusKeyword
        )
      : undefined

    return new Post(
      slug,
      frontmatter.title,
      frontmatter.excerpt,
      frontmatter.date,
      frontmatter.readingTime,
      frontmatter.tags,
      content,
      PlainTextContent.fromMarkdown(content),
      frontmatter.featured,
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
    return this.seoMetadata?.description || this.excerpt
  }

  get focusKeyword(): string | undefined {
    return this.seoMetadata?.focusKeyword
  }

  toDto(): PostDto {
    return {
      slug: this.slug,
      title: this.title,
      excerpt: this.excerpt,
      date: this.date,
      readingTime: this.readingTime,
      tags: this.tags,
      content: this.content,
      plainTextContent: this.plainText.toString(),
      featured: this.featured,
      // SEO fields
      metaTitle: this.metaTitle,
      metaDescription: this.metaDescription,
      focusKeyword: this.focusKeyword,
    }
  }
}
