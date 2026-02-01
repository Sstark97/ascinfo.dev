import { MDXContentRepository } from "./MDXContentRepository"
import { NotionContentRepository } from "./notion/NotionContentRepository"
import { Client } from "@notionhq/client"
import type { ContentRepository } from "@/content/domain/repositories/ContentRepository"

import { GetAllPosts } from "@/content/application/use-cases/posts/GetAllPosts"
import { GetPostBySlug } from "@/content/application/use-cases/posts/GetPostBySlug"
import { GetAllPostTags } from "@/content/application/use-cases/posts/GetAllPostTags"
import { GetFeaturedPost } from "@/content/application/use-cases/posts/GetFeaturedPost"

import { GetAllProjects } from "@/content/application/use-cases/projects/GetAllProjects"
import { GetProjectBySlug } from "@/content/application/use-cases/projects/GetProjectBySlug"
import { GetAllProjectTags } from "@/content/application/use-cases/projects/GetAllProjectTags"
import { GetFeaturedProject } from "@/content/application/use-cases/projects/GetFeaturedProject"

import { GetAllTalks } from "@/content/application/use-cases/talks/GetAllTalks"
import { GetTalkBySlug } from "@/content/application/use-cases/talks/GetTalkBySlug"
import { GetAllTalkTags } from "@/content/application/use-cases/talks/GetAllTalkTags"
import { GetFeaturedTalk } from "@/content/application/use-cases/talks/GetFeaturedTalk"

/**
 * Factory function to create the appropriate ContentRepository based on CMS_PROVIDER env variable
 * Supports "mdx" (default) and "notion" providers
 */
function createContentRepository(): ContentRepository {
  const provider = process.env.CMS_PROVIDER ?? "mdx"

  if (provider === "notion") {
    const apiKey = process.env.NOTION_API_KEY
    const postsDbId = process.env.NOTION_POSTS_DATABASE_ID
    const projectsDbId = process.env.NOTION_PROJECTS_DATABASE_ID
    const talksDbId = process.env.NOTION_TALKS_DATABASE_ID

    if (!apiKey || !postsDbId || !projectsDbId || !talksDbId) {
      console.warn(
        "Notion configuration incomplete, falling back to MDX repository. " +
        "Required: NOTION_API_KEY, NOTION_POSTS_DATABASE_ID, NOTION_PROJECTS_DATABASE_ID, NOTION_TALKS_DATABASE_ID"
      )
      return new MDXContentRepository()
    }

    const notion = new Client({ auth: apiKey })
    return new NotionContentRepository(notion, {
      posts: postsDbId,
      projects: projectsDbId,
      talks: talksDbId,
    })
  }

  return new MDXContentRepository()
}

const contentRepository = createContentRepository()

export const posts = {
  getAll: new GetAllPosts(contentRepository),
  getBySlug: new GetPostBySlug(contentRepository),
  getAllTags: new GetAllPostTags(contentRepository),
  getFeatured: new GetFeaturedPost(contentRepository),
}

export const projects = {
  getAll: new GetAllProjects(contentRepository),
  getBySlug: new GetProjectBySlug(contentRepository),
  getAllTags: new GetAllProjectTags(contentRepository),
  getFeatured: new GetFeaturedProject(contentRepository),
}

export const talks = {
  getAll: new GetAllTalks(contentRepository),
  getBySlug: new GetTalkBySlug(contentRepository),
  getAllTags: new GetAllTalkTags(contentRepository),
  getFeatured: new GetFeaturedTalk(contentRepository),
}
