import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"
import type { Talk } from "../domain/entities/Talk"
import type { TalkRepository } from "../domain/repositories/TalkRepository"

const TALKS_DIR = path.join(process.cwd(), "src/content/talks")

type TalkFrontmatter = Omit<Talk, "slug">

export class MDXTalkRepository implements TalkRepository {
  async getAll(): Promise<Talk[]> {
    const files = await this.getTalkFiles()
    const talks = await Promise.all(files.map((file) => this.parseTalkFile(file)))
    return talks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  async getAllTags(): Promise<string[]> {
    const talks = await this.getAll()
    const tagsSet = new Set<string>()
    talks.forEach((talk) => talk.tags.forEach((tag) => tagsSet.add(tag)))
    return Array.from(tagsSet).sort()
  }

  async getFeatured(): Promise<Talk | null> {
    const talks = await this.getAll()
    const featured = talks.find((talk) => talk.featured)
    return featured ?? talks[0] ?? null
  }

  private async getTalkFiles(): Promise<string[]> {
    try {
      const files = await fs.readdir(TALKS_DIR)
      return files.filter((file) => file.endsWith(".mdx")).map((file) => path.join(TALKS_DIR, file))
    } catch {
      return []
    }
  }

  private async parseTalkFile(filePath: string): Promise<Talk> {
    const fileContent = await fs.readFile(filePath, "utf-8")
    const { data } = matter(fileContent)
    const slug = path.basename(filePath, ".mdx")
    const frontmatter = data as TalkFrontmatter

    return {
      slug,
      title: frontmatter.title,
      event: frontmatter.event,
      date: frontmatter.date,
      location: frontmatter.location,
      slidesUrl: frontmatter.slidesUrl,
      videoUrl: frontmatter.videoUrl,
      tags: frontmatter.tags,
      featured: frontmatter.featured,
      description: frontmatter.description,
    }
  }
}
