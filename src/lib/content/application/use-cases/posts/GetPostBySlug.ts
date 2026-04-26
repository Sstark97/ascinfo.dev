import path from "path"
import { Post, PostFrontmatter } from "@/content/domain/entities/Post"
import type { ContentRepository } from "@/content/domain/repositories/ContentRepository"
import type { Locale } from "@/content/domain/types/Locale"

const POSTS_DIR = path.join(process.cwd(), "src/content/posts")

export class GetPostBySlug {
  constructor(private readonly contentRepository: ContentRepository) {}

  async execute(slug: string, locale: Locale): Promise<Post | null> {
    const raw = await this.contentRepository.readBySlug<PostFrontmatter>(POSTS_DIR, locale, slug)
    if (!raw) return null
    return Post.create(raw.slug, raw.frontmatter, raw.content)
  }
}
