// Domain exports
export type { Post } from "./domain/entities/Post"
export type { Project, ProjectStatus } from "./domain/entities/Project"
export type { Talk } from "./domain/entities/Talk"

export type { PostRepository } from "./domain/repositories/PostRepository"
export type { ProjectRepository } from "./domain/repositories/ProjectRepository"
export type { TalkRepository } from "./domain/repositories/TalkRepository"

// Infrastructure exports
export { compileMDXContent } from "./infrastructure/mdx/compiler"
export { mdxComponents } from "./infrastructure/mdx/components"

// Repository instances (MDX implementation)
// To switch to Notion: replace these imports with NotionXxxRepository
import { MDXPostRepository } from "./infrastructure/MDXPostRepository"
import { MDXProjectRepository } from "./infrastructure/MDXProjectRepository"
import { MDXTalkRepository } from "./infrastructure/MDXTalkRepository"

export const postRepository = new MDXPostRepository()
export const projectRepository = new MDXProjectRepository()
export const talkRepository = new MDXTalkRepository()
