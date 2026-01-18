import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { MDXContentRepository } from "@/src/lib/content/infrastructure/MDXContentRepository"
import type { PostFrontmatter } from "@/src/lib/content/domain/entities/Post"
import fs from "fs/promises"
import path from "path"

const TEST_DIR = path.join(process.cwd(), "tests/lib/content/__test-content__")

describe("MDXContentRepository (Integration)", () => {
  beforeAll(async () => {
    await fs.mkdir(TEST_DIR, { recursive: true })
    await fs.writeFile(
      path.join(TEST_DIR, "test-post.mdx"),
      `---
title: Test Post
excerpt: Test excerpt
date: 2024-01-15
readingTime: 5 min
tags: [typescript, testing]
featured: false
---

# Test Content

This is a test MDX file.`
    )

    await fs.writeFile(
      path.join(TEST_DIR, "another-post.mdx"),
      `---
title: Another Post
excerpt: Another excerpt
date: 2024-01-20
readingTime: 3 min
tags: [react]
featured: true
---

# Another Content`
    )
  })

  afterAll(async () => {
    await fs.rm(TEST_DIR, { recursive: true, force: true })
  })

  it("should read all MDX files from directory", async () => {
    const repo = new MDXContentRepository()
    const results = await repo.readAll<PostFrontmatter>(TEST_DIR)

    expect(results).toHaveLength(2)
    expect(results.some((r) => r.slug === "test-post")).toBe(true)
    expect(results.some((r) => r.slug === "another-post")).toBe(true)
  })

  it("should correctly parse frontmatter", async () => {
    const repo = new MDXContentRepository()
    const result = await repo.readBySlug<PostFrontmatter>(TEST_DIR, "test-post")

    expect(result).not.toBeNull()
    expect(result?.frontmatter.title).toBe("Test Post")
    expect(result?.frontmatter.excerpt).toBe("Test excerpt")
    // gray-matter parses dates as Date objects
    expect(result?.frontmatter.date).toEqual(new Date("2024-01-15"))
    expect(result?.frontmatter.readingTime).toBe("5 min")
    expect(result?.frontmatter.tags).toEqual(["typescript", "testing"])
    expect(result?.frontmatter.featured).toBe(false)
  })

  it("should correctly parse content", async () => {
    const repo = new MDXContentRepository()
    const result = await repo.readBySlug<PostFrontmatter>(TEST_DIR, "test-post")

    expect(result).not.toBeNull()
    expect(result?.content).toContain("# Test Content")
    expect(result?.content).toContain("This is a test MDX file.")
  })

  it("should read single file by slug", async () => {
    const repo = new MDXContentRepository()
    const result = await repo.readBySlug<PostFrontmatter>(TEST_DIR, "test-post")

    expect(result).not.toBeNull()
    expect(result?.slug).toBe("test-post")
  })

  it("should return null for non-existent slug", async () => {
    const repo = new MDXContentRepository()
    const result = await repo.readBySlug<PostFrontmatter>(TEST_DIR, "non-existent")

    expect(result).toBeNull()
  })

  it("should return empty array for non-existent directory", async () => {
    const repo = new MDXContentRepository()
    const results = await repo.readAll<PostFrontmatter>("/non/existent/path")

    expect(results).toEqual([])
  })

  it("should handle multiple files with different frontmatter", async () => {
    const repo = new MDXContentRepository()
    const results = await repo.readAll<PostFrontmatter>(TEST_DIR)

    const testPost = results.find((r) => r.slug === "test-post")
    const anotherPost = results.find((r) => r.slug === "another-post")

    expect(testPost?.frontmatter.featured).toBe(false)
    expect(anotherPost?.frontmatter.featured).toBe(true)
    expect(testPost?.frontmatter.tags).toHaveLength(2)
    expect(anotherPost?.frontmatter.tags).toHaveLength(1)
  })
})
