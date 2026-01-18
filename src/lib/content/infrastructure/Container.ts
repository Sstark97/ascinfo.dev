import { MDXContentRepository } from "./MDXContentRepository"

import { GetAllPosts } from "../domain/use-cases/posts/GetAllPosts"
import { GetPostBySlug } from "../domain/use-cases/posts/GetPostBySlug"
import { GetAllPostTags } from "../domain/use-cases/posts/GetAllPostTags"
import { GetFeaturedPost } from "../domain/use-cases/posts/GetFeaturedPost"

import { GetAllProjects } from "../domain/use-cases/projects/GetAllProjects"
import { GetProjectBySlug } from "../domain/use-cases/projects/GetProjectBySlug"
import { GetAllProjectTags } from "../domain/use-cases/projects/GetAllProjectTags"
import { GetFeaturedProject } from "../domain/use-cases/projects/GetFeaturedProject"

import { GetAllTalks } from "../domain/use-cases/talks/GetAllTalks"
import { GetTalkBySlug } from "../domain/use-cases/talks/GetTalkBySlug"
import { GetAllTalkTags } from "../domain/use-cases/talks/GetAllTalkTags"
import { GetFeaturedTalk } from "../domain/use-cases/talks/GetFeaturedTalk"

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
