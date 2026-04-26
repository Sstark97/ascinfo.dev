import { Post } from "@/content/domain/entities/Post"
import { GetAllPosts } from "./GetAllPosts"
import type { ContentRepository } from "@/content/domain/repositories/ContentRepository"
import type { Locale } from "@/content/domain/types/Locale"

export class GetFeaturedPost {
  private readonly getAllPosts: GetAllPosts

  constructor(contentRepository: ContentRepository) {
    this.getAllPosts = new GetAllPosts(contentRepository)
  }

  async execute(locale: Locale): Promise<Post | null> {
    const posts = await this.getAllPosts.execute(locale)
    const featured = posts.find((post) => post.featured)
    return featured ?? posts[0] ?? null
  }
}
