export type PostDto = {
  slug: string
  title: string
  excerpt: string
  date: string
  readingTime: string
  tags: string[]
  featured?: boolean
  content: string
  plainTextContent: string
  // SEO fields
  metaTitle: string
  metaDescription: string
  focusKeyword?: string
}
