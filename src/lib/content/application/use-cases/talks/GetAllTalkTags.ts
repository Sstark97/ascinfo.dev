import { GetAllTalks } from "./GetAllTalks"
import type { ContentRepository } from "@/content/domain/repositories/ContentRepository"
import type { Locale } from "@/content/domain/types/Locale"

export class GetAllTalkTags {
  private readonly getAllTalks: GetAllTalks

  constructor(contentRepository: ContentRepository) {
    this.getAllTalks = new GetAllTalks(contentRepository)
  }

  async execute(locale: Locale): Promise<string[]> {
    const talks = await this.getAllTalks.execute(locale)
    const tagsSet = new Set<string>()
    talks.forEach((talk) => talk.tags.forEach((tag) => tagsSet.add(tag)))
    return Array.from(tagsSet).sort()
  }
}
