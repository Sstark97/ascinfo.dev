import path from "path"
import { Post, PostFrontmatter } from "@/content/domain/entities/Post"
import type { ContentRepository } from "@/content/domain/repositories/ContentRepository"
import type { Locale } from "@/content/domain/types/Locale"

const POSTS_DIR = path.join(process.cwd(), "src/content/posts")

export class GetAllPosts {
  constructor(private readonly contentRepository: ContentRepository) {}

  async execute(locale: Locale): Promise<Post[]> {
    const rawPosts = await this.contentRepository.readAll<PostFrontmatter>(POSTS_DIR, locale)
    const posts = rawPosts.map(({ slug, frontmatter, content }) =>
      Post.create(slug, frontmatter, content)
    )
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
}
