export type TalkDto = {
  slug: string
  title: string
  description: string
  date: string
  event: string
  location: string
  tags: string[]
  content: string
  plainTextContent: string
  featured?: boolean
  slidesUrl?: string
  videoUrl?: string
  // SEO fields
  metaTitle: string
  metaDescription: string
}
