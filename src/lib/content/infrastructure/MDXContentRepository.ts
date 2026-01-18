import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"
import type { ContentRepository, RawContent } from "@/content/domain/repositories/ContentRepository"

export class MDXContentRepository implements ContentRepository {
  async readAll<F>(directory: string): Promise<RawContent<F>[]> {
    try {
      const files = await fs.readdir(directory)
      const mdxFiles = files.filter((file) => file.endsWith(".mdx"))
      return Promise.all(mdxFiles.map((file) => this.parseFile<F>(path.join(directory, file))))
    } catch {
      return []
    }
  }

  async readBySlug<F>(directory: string, slug: string): Promise<RawContent<F> | null> {
    try {
      const filePath = path.join(directory, `${slug}.mdx`)
      return await this.parseFile<F>(filePath)
    } catch {
      return null
    }
  }

  private async parseFile<F>(filePath: string): Promise<RawContent<F>> {
    const fileContent = await fs.readFile(filePath, "utf-8")
    const { data, content } = matter(fileContent)
    const slug = path.basename(filePath, ".mdx")
    return { slug, frontmatter: data as F, content }
  }
}
