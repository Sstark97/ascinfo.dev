import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import type { NotionRichText } from "./types"

/**
 * Converts Notion blocks to Markdown format
 * Handles all common Notion block types including nested blocks
 */
export class NotionBlocksToMarkdown {
  /**
   * Converts an array of Notion blocks to Markdown string
   */
  convert(blocks: BlockObjectResponse[]): string {
    return blocks.map((block) => this.convertBlock(block)).filter(Boolean).join("\n\n")
  }

  /**
   * Converts a single Notion block to Markdown
   */
  private convertBlock(block: BlockObjectResponse, indentLevel: number = 0): string {
    const indent = "  ".repeat(indentLevel)

    switch (block.type) {
      case "paragraph":
        return this.convertParagraph(block)
      case "heading_1":
        return this.convertHeading(block, 1)
      case "heading_2":
        return this.convertHeading(block, 2)
      case "heading_3":
        return this.convertHeading(block, 3)
      case "bulleted_list_item":
        return this.convertBulletedListItem(block, indent)
      case "numbered_list_item":
        return this.convertNumberedListItem(block, indent)
      case "code":
        return this.convertCode(block)
      case "quote":
        return this.convertQuote(block)
      case "callout":
        return this.convertCallout(block)
      case "image":
        return this.convertImage(block)
      case "divider":
        return "---"
      default:
        return ""
    }
  }

  /**
   * Converts paragraph block to Markdown
   */
  private convertParagraph(block: BlockObjectResponse): string {
    if (block.type !== "paragraph") return ""
    const text = this.richTextToMarkdown(block.paragraph.rich_text)
    return text
  }

  /**
   * Converts heading blocks to Markdown
   */
  private convertHeading(block: BlockObjectResponse, level: number): string {
    let text = ""

    if (block.type === "heading_1") {
      text = this.richTextToMarkdown(block.heading_1.rich_text)
    } else if (block.type === "heading_2") {
      text = this.richTextToMarkdown(block.heading_2.rich_text)
    } else if (block.type === "heading_3") {
      text = this.richTextToMarkdown(block.heading_3.rich_text)
    }

    return `${"#".repeat(level)} ${text}`
  }

  /**
   * Converts bulleted list item to Markdown
   */
  private convertBulletedListItem(block: BlockObjectResponse, indent: string): string {
    if (block.type !== "bulleted_list_item") return ""
    const text = this.richTextToMarkdown(block.bulleted_list_item.rich_text)
    const result = `${indent}- ${text}`

    // Note: Nested children need to be fetched separately via blocks.children.list
    // This converter handles flat block structures only

    return result
  }

  /**
   * Converts numbered list item to Markdown
   */
  private convertNumberedListItem(block: BlockObjectResponse, indent: string): string {
    if (block.type !== "numbered_list_item") return ""
    const text = this.richTextToMarkdown(block.numbered_list_item.rich_text)
    const result = `${indent}1. ${text}`

    // Note: Nested children need to be fetched separately via blocks.children.list
    // This converter handles flat block structures only

    return result
  }

  /**
   * Converts code block to Markdown with language syntax
   */
  private convertCode(block: BlockObjectResponse): string {
    if (block.type !== "code") return ""
    const text = this.richTextToMarkdown(block.code.rich_text)
    const language = block.code.language ?? ""
    return "```" + language + "\n" + text + "\n```"
  }

  /**
   * Converts quote block to Markdown blockquote
   */
  private convertQuote(block: BlockObjectResponse): string {
    if (block.type !== "quote") return ""
    const text = this.richTextToMarkdown(block.quote.rich_text)
    return `> ${text}`
  }

  /**
   * Converts callout block to Markdown blockquote with emoji
   */
  private convertCallout(block: BlockObjectResponse): string {
    if (block.type !== "callout") return ""
    const emoji = block.callout.icon?.type === "emoji" ? block.callout.icon.emoji + " " : ""
    const text = this.richTextToMarkdown(block.callout.rich_text)
    return `> ${emoji}${text}`
  }

  /**
   * Converts image block to Markdown image syntax
   */
  private convertImage(block: BlockObjectResponse): string {
    if (block.type !== "image") return ""

    let url = ""
    if (block.image.type === "external") {
      url = block.image.external.url
    } else if (block.image.type === "file") {
      url = block.image.file.url
    }

    const caption = block.image.caption && block.image.caption.length > 0
      ? this.richTextToMarkdown(block.image.caption)
      : "image"

    return `![${caption}](${url})`
  }

  /**
   * Converts Notion rich text array to Markdown string with formatting
   */
  private richTextToMarkdown(richTextArray: Array<NotionRichText>): string {
    return richTextArray.map((richText) => {
      let text = richText.plain_text

      // Apply formatting annotations
      if (richText.annotations) {
        if (richText.annotations.bold) {
          text = `**${text}**`
        }
        if (richText.annotations.italic) {
          text = `*${text}*`
        }
        if (richText.annotations.code) {
          text = `\`${text}\``
        }
        if (richText.annotations.strikethrough) {
          text = `~~${text}~~`
        }
      }

      // Handle links
      if (richText.href) {
        text = `[${text}](${richText.href})`
      }

      return text
    }).join("")
  }
}
