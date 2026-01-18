import { Post } from "../../../domain/entities/Post"
import { GetAllPosts } from "./GetAllPosts"
import type { ContentRepository } from "../../../domain/repositories/ContentRepository"

export class GetFeaturedPost {
  private readonly getAllPosts: GetAllPosts

  constructor(contentRepository: ContentRepository) {
    this.getAllPosts = new GetAllPosts(contentRepository)
  }

  async execute(): Promise<Post | null> {
    const posts = await this.getAllPosts.execute()
    const featured = posts.find((post) => post.featured)
    return featured ?? posts[0] ?? null
  }
}
