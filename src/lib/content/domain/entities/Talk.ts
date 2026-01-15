export type Talk = {
  slug: string
  title: string
  event: string
  date: string
  location: string
  slidesUrl?: string
  videoUrl?: string
  tags: string[]
  featured?: boolean
  description?: string
  content: string
}
