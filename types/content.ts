// Project frontmatter - matches Astro Content Collections schema
export interface ProjectFrontmatter {
  title: string
  description: string
  heroImage: string
  tags: string[]
  repoUrl: string
  demoUrl?: string
  status: "active" | "maintenance" | "archived"
  // Optional extended metadata
  stars?: number
  forks?: number
  lastCommit?: string
  license?: string
}

// Blog post frontmatter
export interface BlogPostFrontmatter {
  slug: string
  title: string
  excerpt: string
  date: string
  readingTime: string
  tags: string[]
}

// Talk/Charla frontmatter
export interface TalkFrontmatter {
  title: string
  event: string
  date: string
  location: string
  slidesUrl?: string
  videoUrl?: string
  tags: string[]
}

// Generic listing item for reusable grid component
export interface ListingItem {
  slug: string
  [key: string]: unknown
}
