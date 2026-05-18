import type { TestimonialDto } from "@/content/application/dto/TestimonialDto"
import type { Locale } from "@/content/domain/types/Locale"

export type TestimonialFrontmatter = {
  author: string
  role: string
  company: string
  quote: string
  locale: Locale
  linkedinUrl: string
  avatarUrl?: string
}

export class Testimonial {
  constructor(
    public readonly slug: string,
    public readonly author: string,
    public readonly role: string,
    public readonly company: string,
    public readonly quote: string,
    public readonly locale: Locale,
    public readonly linkedinUrl: string,
    public readonly avatarUrl: string | undefined
  ) {}

  static create(slug: string, frontmatter: TestimonialFrontmatter): Testimonial {
    return new Testimonial(
      slug,
      frontmatter.author,
      frontmatter.role,
      frontmatter.company,
      frontmatter.quote,
      frontmatter.locale,
      frontmatter.linkedinUrl,
      frontmatter.avatarUrl
    )
  }

  toDto(): TestimonialDto {
    return {
      slug: this.slug,
      author: this.author,
      role: this.role,
      company: this.company,
      quote: this.quote,
      locale: this.locale,
      linkedinUrl: this.linkedinUrl,
      avatarUrl: this.avatarUrl,
    }
  }
}
