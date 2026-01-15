import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"
import type { Project } from "../domain/entities/Project"
import type { ProjectRepository } from "../domain/repositories/ProjectRepository"

const PROJECTS_DIR = path.join(process.cwd(), "src/content/projects")

type ProjectFrontmatter = Omit<Project, "slug" | "content">

export class MDXProjectRepository implements ProjectRepository {
  async getAll(): Promise<Project[]> {
    const files = await this.getProjectFiles()
    const projects = await Promise.all(files.map((file) => this.parseProjectFile(file)))
    return projects.sort((a, b) => {
      const statusOrder = { active: 0, maintenance: 1, archived: 2 }
      return statusOrder[a.status] - statusOrder[b.status]
    })
  }

  async getBySlug(slug: string): Promise<Project | null> {
    try {
      const filePath = path.join(PROJECTS_DIR, `${slug}.mdx`)
      return await this.parseProjectFile(filePath)
    } catch {
      return null
    }
  }

  async getAllTags(): Promise<string[]> {
    const projects = await this.getAll()
    const tagsSet = new Set<string>()
    projects.forEach((project) => project.tags.forEach((tag) => tagsSet.add(tag)))
    return Array.from(tagsSet).sort()
  }

  async getFeatured(): Promise<Project | null> {
    const projects = await this.getAll()
    const featured = projects.find((project) => project.featured)
    return featured ?? projects[0] ?? null
  }

  private async getProjectFiles(): Promise<string[]> {
    try {
      const files = await fs.readdir(PROJECTS_DIR)
      return files.filter((file) => file.endsWith(".mdx")).map((file) => path.join(PROJECTS_DIR, file))
    } catch {
      return []
    }
  }

  private async parseProjectFile(filePath: string): Promise<Project> {
    const fileContent = await fs.readFile(filePath, "utf-8")
    const { data, content } = matter(fileContent)
    const slug = path.basename(filePath, ".mdx")
    const frontmatter = data as ProjectFrontmatter

    return {
      slug,
      title: frontmatter.title,
      description: frontmatter.description,
      heroImage: frontmatter.heroImage,
      tags: frontmatter.tags,
      repoUrl: frontmatter.repoUrl,
      demoUrl: frontmatter.demoUrl,
      status: frontmatter.status,
      featured: frontmatter.featured,
      stars: frontmatter.stars,
      forks: frontmatter.forks,
      lastCommit: frontmatter.lastCommit,
      license: frontmatter.license,
      content,
    }
  }
}
