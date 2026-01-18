export type RawContent<F> = {
  slug: string
  frontmatter: F
  content: string
}

export type ContentRepository = {
  readAll<F>(directory: string): Promise<RawContent<F>[]>
  readBySlug<F>(directory: string, slug: string): Promise<RawContent<F> | null>
}
