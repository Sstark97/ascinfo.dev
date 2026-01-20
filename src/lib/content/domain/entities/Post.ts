import type { PostDto } from "@/content/application/dto/PostDto"
import { PlainTextContent } from "../value-objects/PlainTextContent"

export type PostFrontmatter = {
  title: string
  excerpt: string
  date: string
  readingTime: string
  tags: string[]
  featured?: boolean
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
    public readonly featured?: boolean
  ) {}

  static create(slug: string, frontmatter: PostFrontmatter, content: string): Post {
    return new Post(
      slug,
      frontmatter.title,
      frontmatter.excerpt,
      frontmatter.date,
      frontmatter.readingTime,
      frontmatter.tags,
      content,
      PlainTextContent.fromMarkdown(content),
      frontmatter.featured
    )
  }

  get plainTextContent(): string {
    return this.plainText.toString()
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
    }
  }
}
