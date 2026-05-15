import { Post } from "@/content/domain/entities/Post"
import { GetAllPosts } from "./GetAllPosts"
import type { ContentRepository } from "@/content/domain/repositories/ContentRepository"
import type { Locale } from "@/content/domain/types/Locale"

export class GetFeaturedPosts {
  private readonly getAllPosts: GetAllPosts

  constructor(contentRepository: ContentRepository) {
    this.getAllPosts = new GetAllPosts(contentRepository)
  }

  async execute(locale: Locale, limit: number): Promise<Post[]> {
    if (limit <= 0) return []
    const posts = await this.getAllPosts.execute(locale)
    return posts.filter((post) => post.featured === true).slice(0, limit)
  }
}
