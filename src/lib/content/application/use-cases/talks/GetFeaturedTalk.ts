import { Talk } from "@/content/domain/entities/Talk"
import { GetAllTalks } from "./GetAllTalks"
import type { ContentRepository } from "@/content/domain/repositories/ContentRepository"
import type { Locale } from "@/content/domain/types/Locale"

export class GetFeaturedTalk {
  private readonly getAllTalks: GetAllTalks

  constructor(contentRepository: ContentRepository) {
    this.getAllTalks = new GetAllTalks(contentRepository)
  }

  async execute(locale: Locale): Promise<Talk | null> {
    const talks = await this.getAllTalks.execute(locale)
    const featured = talks.find((talk) => talk.featured)
    return featured ?? talks[0] ?? null
  }
}
