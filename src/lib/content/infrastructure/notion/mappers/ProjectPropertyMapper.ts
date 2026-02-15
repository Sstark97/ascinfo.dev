import type { ProjectFrontmatter, ProjectStatus } from "@/content/domain/entities/Project"
import type { NotionProperties } from "../types"

/**
 * Maps Notion page properties to ProjectFrontmatter
 */
export class ProjectPropertyMapper {
  /**
   * Extracts and maps Notion properties to ProjectFrontmatter
   */
  mapToFrontmatter(properties: NotionProperties): ProjectFrontmatter {
    return {
      title: this.extractTitle(properties),
      description: this.extractRichText(properties, "Description"),
      heroImage: this.extractUrl(properties, "Hero Image"),
      tags: this.extractMultiSelect(properties, "Tags"),
      repoUrl: this.extractUrl(properties, "Repo URL") ?? "",
      demoUrl: this.extractUrl(properties, "Demo URL"),
      status: this.extractStatus(properties),
      featured: this.extractCheckbox(properties, "Featured"),
      stars: this.extractNumber(properties, "Stars"),
      forks: this.extractNumber(properties, "Forks"),
      lastCommit: this.extractDate(properties, "Last Commit"),
      license: this.extractRichText(properties, "License") || undefined,
      // SEO fields
      seoTitle: this.extractRichText(properties, "SEO Title") || undefined,
      seoDescription: this.extractRichText(properties, "SEO Description") || undefined,
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
   * Extracts URL from URL property
   */
  private extractUrl(properties: NotionProperties, propertyName: string): string | undefined {
    const property = properties[propertyName]
    if (property?.type === "url" && property.url) {
      return property.url
    }
    return undefined
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
   * Extracts status and validates it matches ProjectStatus type
   */
  private extractStatus(properties: NotionProperties): ProjectStatus {
    const property = properties["Status"]
    if (property?.type === "select" && property.select) {
      const status = property.select.name.toLowerCase()
      if (status === "active" || status === "maintenance" || status === "archived") {
        return status as ProjectStatus
      }
    }
    return "active" // Default fallback
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

  /**
   * Extracts number value
   */
  private extractNumber(properties: NotionProperties, propertyName: string): number | undefined {
    const property = properties[propertyName]
    if (property?.type === "number" && property.number !== null) {
      return property.number
    }
    return undefined
  }

  /**
   * Extracts date and formats it as ISO string
   */
  private extractDate(properties: NotionProperties, propertyName: string): string | undefined {
    const property = properties[propertyName]
    if (property?.type === "date" && property.date) {
      return property.date.start
    }
    return undefined
  }
}
