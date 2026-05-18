import { Client } from "@notionhq/client"
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { Testimonial } from "@/content/domain/entities/Testimonial"
import type { TestimonialRepository } from "@/content/domain/repositories/TestimonialRepository"
import type { Locale } from "@/content/domain/types/Locale"
import { TestimonialPropertyMapper } from "./mappers/TestimonialPropertyMapper"
import type { NotionProperties } from "./types"
import { isFullPage } from "./types"

type NotionTestimonialDatabaseIds = {
  testimonials: string
}

export class NotionTestimonialRepository implements TestimonialRepository {
  private readonly mapper: TestimonialPropertyMapper

  constructor(
    private readonly client: Client,
    private readonly databaseIds: NotionTestimonialDatabaseIds
  ) {
    this.mapper = new TestimonialPropertyMapper()
  }

  async readAll(locale: Locale): Promise<Testimonial[]> {
    try {
      const response = (await this.client.request({
        path: `data_sources/${this.databaseIds.testimonials}/query`,
        method: "post",
        body: {
          filter: { property: "Locale", select: { equals: locale } },
        },
      })) as { results: Array<PageObjectResponse | Record<string, unknown>> }

      const testimonials: Testimonial[] = []
      for (const page of response.results) {
        const mapped = this.mapPageToTestimonial(page)
        if (mapped !== undefined) testimonials.push(mapped)
      }
      return testimonials
    } catch (error) {
      console.error("Error reading testimonials from Notion:", error)
      return []
    }
  }

  private mapPageToTestimonial(
    page: PageObjectResponse | Record<string, unknown>
  ): Testimonial | undefined {
    if (!isFullPage(page as PageObjectResponse)) return undefined
    const fullPage = page as PageObjectResponse
    const properties = fullPage.properties as NotionProperties
    const slug = this.mapper.extractSlug(properties)
    if (slug === undefined) return undefined
    const frontmatter = this.mapper.mapToFrontmatter(properties)
    return Testimonial.create(slug, frontmatter)
  }
}
