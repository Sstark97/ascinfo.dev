import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"
import type { Post } from "../domain/entities/Post"
import type { PostRepository } from "../domain/repositories/PostRepository"

const POSTS_DIR = path.join(process.cwd(), "src/content/posts")

type PostFrontmatter = Omit<Post, "slug" | "content">

export class MDXPostRepository implements PostRepository {
  async getAll(): Promise<Post[]> {
    const files = await this.getPostFiles()
    const posts = await Promise.all(files.map((file) => this.parsePostFile(file)))
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  async getBySlug(slug: string): Promise<Post | null> {
    try {
      const filePath = path.join(POSTS_DIR, `${slug}.mdx`)
      return await this.parsePostFile(filePath)
    } catch {
      return null
    }
  }

  async getAllTags(): Promise<string[]> {
    const posts = await this.getAll()
    const tagsSet = new Set<string>()
    posts.forEach((post) => post.tags.forEach((tag) => tagsSet.add(tag)))
    return Array.from(tagsSet).sort()
  }

  async getFeatured(): Promise<Post | null> {
    const posts = await this.getAll()
    const featured = posts.find((post) => post.featured)
    return featured ?? posts[0] ?? null
  }

  private async getPostFiles(): Promise<string[]> {
    try {
      const files = await fs.readdir(POSTS_DIR)
      return files.filter((file) => file.endsWith(".mdx")).map((file) => path.join(POSTS_DIR, file))
    } catch {
      return []
    }
  }

  private async parsePostFile(filePath: string): Promise<Post> {
    const fileContent = await fs.readFile(filePath, "utf-8")
    const { data, content } = matter(fileContent)
    const slug = path.basename(filePath, ".mdx")
    const frontmatter = data as PostFrontmatter

    return {
      slug,
      title: frontmatter.title,
      excerpt: frontmatter.excerpt,
      date: frontmatter.date,
      readingTime: frontmatter.readingTime,
      tags: frontmatter.tags,
      featured: frontmatter.featured,
      content,
    }
  }
}
