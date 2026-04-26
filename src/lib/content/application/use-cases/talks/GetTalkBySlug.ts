import path from "path"
import { Talk, TalkFrontmatter } from "@/content/domain/entities/Talk"
import type { ContentRepository } from "@/content/domain/repositories/ContentRepository"
import type { Locale } from "@/content/domain/types/Locale"

const TALKS_DIR = path.join(process.cwd(), "src/content/talks")

export class GetTalkBySlug {
  constructor(private readonly contentRepository: ContentRepository) {}

  async execute(slug: string, locale: Locale): Promise<Talk | null> {
    const raw = await this.contentRepository.readBySlug<TalkFrontmatter>(TALKS_DIR, locale, slug)
    if (!raw) return null
    return Talk.create(raw.slug, raw.frontmatter, raw.content)
  }
}
