import type { RawContent } from "@/src/lib/content/domain/repositories/ContentRepository"
import type { TalkFrontmatter } from "@/src/lib/content/domain/entities/Talk"

export const mockTalkFrontmatter: TalkFrontmatter = {
  title: "Test Talk",
  event: "Test Conference 2024",
  date: "2024-01-15",
  location: "Madrid, Spain",
  tags: ["typescript", "testing"],
  featured: false,
}

export const mockRawTalk: RawContent<TalkFrontmatter> = {
  slug: "test-talk",
  frontmatter: mockTalkFrontmatter,
  content: "# Test Talk Content",
}

export const mockFeaturedTalk: RawContent<TalkFrontmatter> = {
  slug: "featured-talk",
  frontmatter: { ...mockTalkFrontmatter, featured: true },
  content: "# Featured Talk Content",
}

export const mockMultipleTalks: RawContent<TalkFrontmatter>[] = [
  {
    slug: "talk-1",
    frontmatter: { ...mockTalkFrontmatter, date: "2024-01-20", tags: ["react"] },
    content: "# Talk 1",
  },
  {
    slug: "talk-2",
    frontmatter: { ...mockTalkFrontmatter, date: "2024-01-15", tags: ["typescript", "nextjs"] },
    content: "# Talk 2",
  },
  {
    slug: "talk-3",
    frontmatter: { ...mockTalkFrontmatter, date: "2024-01-25", tags: ["testing"] },
    content: "# Talk 3",
  },
]
