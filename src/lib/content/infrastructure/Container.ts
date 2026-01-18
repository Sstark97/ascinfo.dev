import { MDXContentRepository } from "./MDXContentRepository"

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

const contentRepository = new MDXContentRepository()

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
