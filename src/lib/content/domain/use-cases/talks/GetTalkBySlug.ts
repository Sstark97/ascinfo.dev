import path from "path"
import { Talk, TalkFrontmatter } from "../../entities/Talk"
import type { ContentRepository } from "../../repositories/ContentRepository"

const TALKS_DIR = path.join(process.cwd(), "src/content/talks")

export class GetTalkBySlug {
  constructor(private readonly contentRepository: ContentRepository) {}

  async execute(slug: string): Promise<Talk | null> {
    const raw = await this.contentRepository.readBySlug<TalkFrontmatter>(TALKS_DIR, slug)
    if (!raw) return null
    return Talk.create(raw.slug, raw.frontmatter, raw.content)
  }
}
