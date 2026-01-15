import type { Talk } from "../entities/Talk"

export type TalkRepository = {
  getAll(): Promise<Talk[]>
  getAllTags(): Promise<string[]>
  getFeatured(): Promise<Talk | null>
}
