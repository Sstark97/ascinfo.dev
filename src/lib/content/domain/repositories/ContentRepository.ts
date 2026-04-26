import type { Locale } from '@/content/domain/types/Locale'

export type RawContent<F> = {
  slug: string
  frontmatter: F
  content: string
}

export type ContentRepository = {
  readAll<F>(directory: string, locale: Locale): Promise<RawContent<F>[]>
  readBySlug<F>(directory: string, locale: Locale, slug: string): Promise<RawContent<F> | null>
}
