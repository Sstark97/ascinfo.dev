import type { Talk } from "../entities/Talk"

export type TalkRepository = {
  getAll(): Promise<Talk[]>
  getBySlug(slug: string): Promise<Talk | null>
  getAllTags(): Promise<string[]>
  getFeatured(): Promise<Talk | null>
}
