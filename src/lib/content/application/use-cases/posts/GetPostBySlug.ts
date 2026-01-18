import path from "path"
import { Post, PostFrontmatter } from "@/content/domain/entities/Post"
import type { ContentRepository } from "@/content/domain/repositories/ContentRepository"

const POSTS_DIR = path.join(process.cwd(), "src/content/posts")

export class GetPostBySlug {
  constructor(private readonly contentRepository: ContentRepository) {}

  async execute(slug: string): Promise<Post | null> {
    const raw = await this.contentRepository.readBySlug<PostFrontmatter>(POSTS_DIR, slug)
    if (!raw) return null
    return Post.create(raw.slug, raw.frontmatter, raw.content)
  }
}
