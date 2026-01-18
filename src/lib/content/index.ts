// Domain exports - Entities
export { Post } from "./domain/entities/Post"
export { Project } from "./domain/entities/Project"
export type { ProjectStatus } from "./domain/entities/Project"
export { Talk } from "./domain/entities/Talk"

// Infrastructure exports
export { compileMDXContent } from "./infrastructure/mdx/compiler"
export { mdxComponents } from "./infrastructure/mdx/components"

// Use cases - Container
export { posts, projects, talks } from "./infrastructure/Container"
