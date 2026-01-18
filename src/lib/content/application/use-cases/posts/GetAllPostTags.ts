import { GetAllPosts } from "./GetAllPosts"
import type { ContentRepository } from "@/content/domain/repositories/ContentRepository"

export class GetAllPostTags {
  private readonly getAllPosts: GetAllPosts

  constructor(contentRepository: ContentRepository) {
    this.getAllPosts = new GetAllPosts(contentRepository)
  }

  async execute(): Promise<string[]> {
    const posts = await this.getAllPosts.execute()
    const tagsSet = new Set<string>()
    posts.forEach((post) => post.tags.forEach((tag) => tagsSet.add(tag)))
    return Array.from(tagsSet).sort()
  }
}
