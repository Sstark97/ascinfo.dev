import type { RawContent } from "@/src/lib/content/domain/repositories/ContentRepository"
import type { PostFrontmatter } from "@/src/lib/content/domain/entities/Post"

export const mockPostFrontmatter: PostFrontmatter = {
  title: "Test Post",
  excerpt: "Test excerpt",
  date: "2024-01-15",
  readingTime: "5 min",
  tags: ["typescript", "testing"],
  featured: false,
}

export const mockRawPost: RawContent<PostFrontmatter> = {
  slug: "test-post",
  frontmatter: mockPostFrontmatter,
  content: "# Test Content",
}

export const mockFeaturedPost: RawContent<PostFrontmatter> = {
  slug: "featured-post",
  frontmatter: { ...mockPostFrontmatter, featured: true },
  content: "# Featured Content",
}

export const mockMultiplePosts: RawContent<PostFrontmatter>[] = [
  {
    slug: "post-1",
    frontmatter: { ...mockPostFrontmatter, date: "2024-01-20", tags: ["react"] },
    content: "# Post 1",
  },
  {
    slug: "post-2",
    frontmatter: { ...mockPostFrontmatter, date: "2024-01-15", tags: ["typescript", "nextjs"] },
    content: "# Post 2",
  },
  {
    slug: "post-3",
    frontmatter: { ...mockPostFrontmatter, date: "2024-01-25", tags: ["testing"] },
    content: "# Post 3",
  },
]
