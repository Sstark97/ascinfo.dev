import type { TestimonialFrontmatter } from "@/content/domain/entities/Testimonial"
import type { Locale } from "@/content/domain/types/Locale"
import type { NotionProperties } from "../types"

export class TestimonialPropertyMapper {
  mapToFrontmatter(properties: NotionProperties): TestimonialFrontmatter {
    return {
      author: this.extractTitle(properties),
      role: this.extractRichText(properties, "Role"),
      company: this.extractRichText(properties, "Company"),
      quote: this.extractRichText(properties, "Quote"),
      locale: this.extractLocale(properties),
      linkedinUrl: this.extractUrl(properties, "LinkedIn URL"),
      avatarUrl: this.extractOptionalRichText(properties, "Avatar Path"),
    }
  }

  extractSlug(properties: NotionProperties): string | undefined {
    const property = properties["Slug"] ?? properties["slug"]
    if (property?.type === "rich_text" && property.rich_text.length > 0) {
      return property.rich_text[0].plain_text
    }
    return undefined
  }

  private extractTitle(properties: NotionProperties): string {
    const property = properties["Author"] ?? properties["author"] ?? properties["Name"]
    if (property?.type === "title" && property.title.length > 0) {
      return property.title[0].plain_text
    }
    return ""
  }

  private extractRichText(properties: NotionProperties, name: string): string {
    const property = properties[name]
    if (property?.type === "rich_text" && property.rich_text.length > 0) {
      return property.rich_text[0].plain_text
    }
    return ""
  }

  private extractOptionalRichText(properties: NotionProperties, name: string): string | undefined {
    const value = this.extractRichText(properties, name)
    return value.length > 0 ? value : undefined
  }

  private extractUrl(properties: NotionProperties, name: string): string {
    const property = properties[name]
    if (property?.type === "url" && property.url !== null && property.url !== undefined) {
      return property.url
    }
    return ""
  }

  private extractLocale(properties: NotionProperties): Locale {
    const property = properties["Locale"]
    if (property?.type === "select" && property.select?.name === "en") return "en"
    return "es"
  }
}
