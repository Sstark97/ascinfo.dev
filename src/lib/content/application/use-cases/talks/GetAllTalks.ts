import path from "path"
import { Talk, TalkFrontmatter } from "@/content/domain/entities/Talk"
import type { ContentRepository } from "@/content/domain/repositories/ContentRepository"
import type { Locale } from "@/content/domain/types/Locale"

const TALKS_DIR = path.join(process.cwd(), "src/content/talks")

export class GetAllTalks {
  constructor(private readonly contentRepository: ContentRepository) {}

  async execute(locale: Locale): Promise<Talk[]> {
    const rawTalks = await this.contentRepository.readAll<TalkFrontmatter>(TALKS_DIR, locale)
    const talks = rawTalks.map(({ slug, frontmatter, content }) =>
      Talk.create(slug, frontmatter, content)
    )
    return talks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
}
