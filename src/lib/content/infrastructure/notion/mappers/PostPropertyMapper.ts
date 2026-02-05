import type { PostFrontmatter } from "@/content/domain/entities/Post"
import type { NotionProperties } from "../types"

/**
 * Maps Notion page properties to PostFrontmatter
 */
export class PostPropertyMapper {
  /**
   * Extracts and maps Notion properties to PostFrontmatter
   */
  mapToFrontmatter(properties: NotionProperties): PostFrontmatter {
    return {
      title: this.extractTitle(properties),
      excerpt: this.extractRichText(properties, "Excerpt"),
      date: this.extractDate(properties, "Date"),
      readingTime: this.extractRichText(properties, "Reading Time"),
      tags: this.extractMultiSelect(properties, "Tags"),
      featured: this.extractCheckbox(properties, "Featured"),
      // SEO fields
      seoTitle: this.extractRichText(properties, "SEO Title") || undefined,
      seoDescription: this.extractRichText(properties, "SEO Description") || undefined,
      focusKeyword: this.extractRichText(properties, "Focus Keyword") || undefined,
    }
  }

  /**
   * Extracts title from title property
   */
  private extractTitle(properties: NotionProperties): string {
    const titleProperty = properties["Title"] ?? properties["title"] ?? properties["Name"]
    if (titleProperty?.type === "title" && titleProperty.title.length > 0) {
      return titleProperty.title[0].plain_text
    }
    return ""
  }

  /**
   * Extracts rich text from a property
   */
  private extractRichText(properties: NotionProperties, propertyName: string): string {
    const property = properties[propertyName]
    if (property?.type === "rich_text" && property.rich_text.length > 0) {
      return property.rich_text[0].plain_text
    }
    return ""
  }

  /**
   * Extracts date and formats it as ISO string
   */
  private extractDate(properties: NotionProperties, propertyName: string): string {
    const property = properties[propertyName]
    if (property?.type === "date" && property.date) {
      return property.date.start
    }
    return ""
  }

  /**
   * Extracts multi-select values as string array
   */
  private extractMultiSelect(properties: NotionProperties, propertyName: string): string[] {
    const property = properties[propertyName]
    if (property?.type === "multi_select") {
      return property.multi_select.map((option) => option.name)
    }
    return []
  }

  /**
   * Extracts checkbox value
   */
  private extractCheckbox(properties: NotionProperties, propertyName: string): boolean | undefined {
    const property = properties[propertyName]
    if (property?.type === "checkbox") {
      return property.checkbox ? true : undefined
    }
    return undefined
  }
}
