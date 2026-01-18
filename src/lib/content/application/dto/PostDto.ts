export type PostDto = {
  slug: string
  title: string
  excerpt: string
  date: string
  readingTime: string
  tags: string[]
  featured?: boolean
  content: string
}
