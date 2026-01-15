import type { Post } from "../entities/Post"

export type PostRepository = {
  getAll(): Promise<Post[]>
  getBySlug(slug: string): Promise<Post | null>
  getAllTags(): Promise<string[]>
  getFeatured(): Promise<Post | null>
}
