import path from "path"
import { Talk, TalkFrontmatter } from "../../entities/Talk"
import type { ContentRepository } from "../../repositories/ContentRepository"

const TALKS_DIR = path.join(process.cwd(), "src/content/talks")

export class GetAllTalks {
  constructor(private readonly contentRepository: ContentRepository) {}

  async execute(): Promise<Talk[]> {
    const rawTalks = await this.contentRepository.readAll<TalkFrontmatter>(TALKS_DIR)
    const talks = rawTalks.map(({ slug, frontmatter, content }) =>
      Talk.create(slug, frontmatter, content)
    )
    return talks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
}
