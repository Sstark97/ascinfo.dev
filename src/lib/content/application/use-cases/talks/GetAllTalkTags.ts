import { GetAllTalks } from "./GetAllTalks"
import type { ContentRepository } from "@/content/domain/repositories/ContentRepository"

export class GetAllTalkTags {
  private readonly getAllTalks: GetAllTalks

  constructor(contentRepository: ContentRepository) {
    this.getAllTalks = new GetAllTalks(contentRepository)
  }

  async execute(): Promise<string[]> {
    const talks = await this.getAllTalks.execute()
    const tagsSet = new Set<string>()
    talks.forEach((talk) => talk.tags.forEach((tag) => tagsSet.add(tag)))
    return Array.from(tagsSet).sort()
  }
}
