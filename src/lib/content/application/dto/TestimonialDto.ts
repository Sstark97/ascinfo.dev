import type { Locale } from "@/content/domain/types/Locale"

export type TestimonialDto = {
  slug: string
  author: string
  role: string
  company: string
  quote: string
  locale: Locale
  linkedinUrl: string
  avatarUrl?: string
}
