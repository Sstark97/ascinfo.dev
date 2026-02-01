import { describe, it, expect } from "vitest"
import { NotionBlocksToMarkdown } from "@/content/infrastructure/notion/NotionBlocksToMarkdown"
import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints"

// Helper to create rich text
const rt = (text: string, opts?: { bold?: boolean; italic?: boolean; code?: boolean; href?: string }) => ({
  type: "text" as const,
  plain_text: text,
  href: opts?.href ?? null,
  annotations: {
    bold: opts?.bold ?? false,
    italic: opts?.italic ?? false,
    strikethrough: false,
    underline: false,
    code: opts?.code ?? false,
    color: "default" as const,
  },
  text: { content: text, link: opts?.href ? { url: opts.href } : null },
})

// Helper for base block props
const base = (id: string) => ({
  object: "block" as const,
  id,
  created_time: "2024-01-01T00:00:00.000Z",
  last_edited_time: "2024-01-01T00:00:00.000Z",
  created_by: { object: "user" as const, id: "u1" },
  last_edited_by: { object: "user" as const, id: "u1" },
  has_children: false,
  archived: false,
  in_trash: false,
  parent: { type: "page_id" as const, page_id: "p1" },
})

describe("NotionBlocksToMarkdown", () => {
  const converter = new NotionBlocksToMarkdown()

  it("should convert empty array", () => {
    expect(converter.convert([])).toBe("")
  })

  it("should convert paragraph", () => {
    const blocks: BlockObjectResponse[] = [
      { ...base("1"), type: "paragraph", paragraph: { rich_text: [rt("Test")], color: "default" } },
    ]
    expect(converter.convert(blocks)).toBe("Test")
  })

  it("should convert headings", () => {
    const blocks: BlockObjectResponse[] = [
      { ...base("1"), type: "heading_1", heading_1: { rich_text: [rt("H1")], color: "default", is_toggleable: false } },
      { ...base("2"), type: "heading_2", heading_2: { rich_text: [rt("H2")], color: "default", is_toggleable: false } },
      { ...base("3"), type: "heading_3", heading_3: { rich_text: [rt("H3")], color: "default", is_toggleable: false } },
    ]
    expect(converter.convert(blocks)).toBe("# H1\n\n## H2\n\n### H3")
  })

  it("should convert bulleted list", () => {
    const blocks: BlockObjectResponse[] = [
      { ...base("1"), type: "bulleted_list_item", bulleted_list_item: { rich_text: [rt("Item")], color: "default" } },
    ]
    expect(converter.convert(blocks)).toBe("- Item")
  })

  it("should convert numbered list", () => {
    const blocks: BlockObjectResponse[] = [
      { ...base("1"), type: "numbered_list_item", numbered_list_item: { rich_text: [rt("Item")], color: "default" } },
    ]
    expect(converter.convert(blocks)).toBe("1. Item")
  })

  it("should convert code block", () => {
    const blocks: BlockObjectResponse[] = [
      {
        ...base("1"),
        type: "code",
        code: { rich_text: [rt("const x = 1")], language: "javascript", caption: [] },
      },
    ]
    expect(converter.convert(blocks)).toBe("```javascript\nconst x = 1\n```")
  })

  it("should convert quote", () => {
    const blocks: BlockObjectResponse[] = [
      { ...base("1"), type: "quote", quote: { rich_text: [rt("Quote")], color: "default" } },
    ]
    expect(converter.convert(blocks)).toBe("> Quote")
  })

  it("should convert callout with emoji", () => {
    const blocks: BlockObjectResponse[] = [
      {
        ...base("1"),
        type: "callout",
        callout: { rich_text: [rt("Note")], icon: { type: "emoji", emoji: "💡" }, color: "default" },
      },
    ]
    expect(converter.convert(blocks)).toBe("> 💡 Note")
  })

  it("should convert image", () => {
    const blocks: BlockObjectResponse[] = [
      {
        ...base("1"),
        type: "image",
        image: { type: "external", external: { url: "http://ex.com/i.png" }, caption: [rt("Alt")] },
      },
    ]
    expect(converter.convert(blocks)).toBe("![Alt](http://ex.com/i.png)")
  })

  it("should convert divider", () => {
    const blocks: BlockObjectResponse[] = [{ ...base("1"), type: "divider", divider: {} }]
    expect(converter.convert(blocks)).toBe("---")
  })

  it("should handle bold text", () => {
    const blocks: BlockObjectResponse[] = [
      { ...base("1"), type: "paragraph", paragraph: { rich_text: [rt("bold", { bold: true })], color: "default" } },
    ]
    expect(converter.convert(blocks)).toBe("**bold**")
  })

  it("should handle italic text", () => {
    const blocks: BlockObjectResponse[] = [
      { ...base("1"), type: "paragraph", paragraph: { rich_text: [rt("italic", { italic: true })], color: "default" } },
    ]
    expect(converter.convert(blocks)).toBe("*italic*")
  })

  it("should handle code text", () => {
    const blocks: BlockObjectResponse[] = [
      { ...base("1"), type: "paragraph", paragraph: { rich_text: [rt("code", { code: true })], color: "default" } },
    ]
    expect(converter.convert(blocks)).toBe("`code`")
  })

  it("should handle links", () => {
    const blocks: BlockObjectResponse[] = [
      {
        ...base("1"),
        type: "paragraph",
        paragraph: { rich_text: [rt("link", { href: "http://ex.com" })], color: "default" },
      },
    ]
    expect(converter.convert(blocks)).toBe("[link](http://ex.com)")
  })

  it("should handle multiple blocks", () => {
    const blocks: BlockObjectResponse[] = [
      { ...base("1"), type: "paragraph", paragraph: { rich_text: [rt("First")], color: "default" } },
      { ...base("2"), type: "paragraph", paragraph: { rich_text: [rt("Second")], color: "default" } },
    ]
    expect(converter.convert(blocks)).toBe("First\n\nSecond")
  })
})
