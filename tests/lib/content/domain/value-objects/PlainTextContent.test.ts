import { describe, it, expect } from "vitest"
import { PlainTextContent } from "@/content/domain/value-objects/PlainTextContent"

describe("PlainTextContent", () => {
  describe("fromMarkdown", () => {
    it("should remove code blocks", () => {
      const markdown = "Text\n```ts\ncode\n```\nMore text"
      const result = PlainTextContent.fromMarkdown(markdown)
      expect(result.toString()).not.toContain("```")
      expect(result.toString()).not.toContain("code")
    })

    it("should remove inline code", () => {
      const markdown = "Use `const` instead"
      const result = PlainTextContent.fromMarkdown(markdown)
      expect(result.toString()).toBe("Use const instead")
    })

    it("should remove heading syntax but preserve text", () => {
      const markdown = "## Heading"
      const result = PlainTextContent.fromMarkdown(markdown)
      expect(result.toString()).toBe("Heading")
    })

    it("should remove bold/italic syntax but preserve text", () => {
      const markdown = "**bold** and *italic*"
      const result = PlainTextContent.fromMarkdown(markdown)
      expect(result.toString()).toBe("bold and italic")
    })

    it("should extract link text and remove URL", () => {
      const markdown = "[Google](https://google.com)"
      const result = PlainTextContent.fromMarkdown(markdown)
      expect(result.toString()).toBe("Google")
    })

    it("should remove HTML/JSX tags", () => {
      const markdown = "<div>Content</div>"
      const result = PlainTextContent.fromMarkdown(markdown)
      expect(result.toString()).toBe("Content")
    })

    it("should normalize whitespace", () => {
      const markdown = "Line 1\n\n\n\nLine 2"
      const result = PlainTextContent.fromMarkdown(markdown)
      expect(result.toString()).toBe("Line 1\n\nLine 2")
    })

    it("should handle empty content", () => {
      const result = PlainTextContent.fromMarkdown("")
      expect(result.toString()).toBe("")
    })
  })

  describe("toString", () => {
    it("should return plain text value", () => {
      const result = PlainTextContent.fromMarkdown("# Test")
      expect(result.toString()).toBe("Test")
    })
  })
})
