import { GetAllPosts } from "./GetAllPosts"
import type { ContentRepository } from "@/content/domain/repositories/ContentRepository"
import type { Locale } from "@/content/domain/types/Locale"

export class GetAllPostTags {
  private readonly getAllPosts: GetAllPosts

  constructor(contentRepository: ContentRepository) {
    this.getAllPosts = new GetAllPosts(contentRepository)
  }

  async execute(locale: Locale): Promise<string[]> {
    const posts = await this.getAllPosts.execute(locale)
    const tagsSet = new Set<string>()
    posts.forEach((post) => post.tags.forEach((tag) => tagsSet.add(tag)))
    return Array.from(tagsSet).sort()
  }
}
