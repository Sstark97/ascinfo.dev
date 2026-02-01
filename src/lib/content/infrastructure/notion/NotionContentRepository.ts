import { Client } from "@notionhq/client"
import type { BlockObjectResponse, PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import type { ContentRepository, RawContent } from "@/content/domain/repositories/ContentRepository"
import { NotionBlocksToMarkdown } from "./NotionBlocksToMarkdown"
import { PostPropertyMapper } from "./mappers/PostPropertyMapper"
import { ProjectPropertyMapper } from "./mappers/ProjectPropertyMapper"
import { TalkPropertyMapper } from "./mappers/TalkPropertyMapper"
import type { DatabaseMapping, NotionProperties } from "./types"
import { isFullPage } from "./types"

/**
 * ContentRepository implementation that uses Notion as the CMS
 * Adapts Notion API to the domain's ContentRepository interface
 */
export class NotionContentRepository implements ContentRepository {
  private readonly blocksToMarkdown: NotionBlocksToMarkdown
  private readonly postMapper: PostPropertyMapper
  private readonly projectMapper: ProjectPropertyMapper
  private readonly talkMapper: TalkPropertyMapper

  constructor(
    private readonly client: Client,
    private readonly databaseMapping: DatabaseMapping
  ) {
    this.blocksToMarkdown = new NotionBlocksToMarkdown()
    this.postMapper = new PostPropertyMapper()
    this.projectMapper = new ProjectPropertyMapper()
    this.talkMapper = new TalkPropertyMapper()
  }

  /**
   * Reads all published content from a Notion database
   * @param directory - The content directory (maps to data source ID)
   * @returns Array of raw content with frontmatter and markdown
   */
  async readAll<F>(directory: string): Promise<RawContent<F>[]> {
    try {
      const dataSourceId = this.getDatabaseId(directory)
      if (!dataSourceId) {
        console.warn(`No database mapping found for directory: ${directory}`)
        return []
      }

      // Using data_sources endpoint (Notion API 2025-09-03)
      const response = (await this.client.request({
        path: `data_sources/${dataSourceId}/query`,
        method: "post",
        body: {
          filter: {
            property: "Status",
            select: { equals: "Published" },
          },
        },
      })) as { results: Array<PageObjectResponse | Record<string, unknown>> }

      const results = await Promise.all(
        response.results.map((page: PageObjectResponse | Record<string, unknown>) =>
          this.mapPageToRawContent<F>(page, directory)
        )
      )

      return results.filter((r): r is RawContent<F> => r !== null)
    } catch (error) {
      console.error(`Error reading all from ${directory}:`, error)
      return []
    }
  }

  /**
   * Reads a single content item by slug from a Notion database
   * @param directory - The content directory (maps to data source ID)
   * @param slug - The content slug to find
   * @returns Raw content or null if not found
   */
  async readBySlug<F>(directory: string, slug: string): Promise<RawContent<F> | null> {
    try {
      const dataSourceId = this.getDatabaseId(directory)
      if (!dataSourceId) {
        console.warn(`No database mapping found for directory: ${directory}`)
        return null
      }

      // Using data_sources endpoint (Notion API 2025-09-03)
      const response = (await this.client.request({
        path: `data_sources/${dataSourceId}/query`,
        method: "post",
        body: {
          filter: {
            and: [
              {
                property: "Slug",
                rich_text: { equals: slug },
              },
              {
                property: "Status",
                select: { equals: "Published" },
              },
            ],
          },
        },
      })) as { results: Array<PageObjectResponse | Record<string, unknown>> }

      if (response.results.length === 0) {
        return null
      }

      return await this.mapPageToRawContent<F>(response.results[0], directory)
    } catch (error) {
      console.error(`Error reading ${slug} from ${directory}:`, error)
      return null
    }
  }

  /**
   * Maps database directory string to Notion data source ID
   * Note: In API 2025-09-03, data_source_id (collection ID) is used instead of database_id
   */
  private getDatabaseId(directory: string): string | null {
    // Extract the last part of the directory path (e.g., "posts" from "src/content/posts")
    const directoryName = directory.split("/").pop() ?? directory
    return this.databaseMapping[directoryName] ?? null
  }

  /**
   * Gets the appropriate property mapper for a directory
   */
  private getPropertyMapper(
    directory: string
  ): PostPropertyMapper | ProjectPropertyMapper | TalkPropertyMapper {
    const directoryName = directory.split("/").pop() ?? directory

    switch (directoryName) {
      case "posts":
        return this.postMapper
      case "projects":
        return this.projectMapper
      case "talks":
        return this.talkMapper
      default:
        return this.postMapper // Default fallback
    }
  }

  /**
   * Maps a Notion page to RawContent
   */
  private async mapPageToRawContent<F>(
    page: PageObjectResponse | Record<string, unknown>,
    directory: string
  ): Promise<RawContent<F> | null> {
    try {
      // Type guard to ensure we have a full page object
      if (!isFullPage(page as PageObjectResponse)) {
        console.warn("Received partial page object, skipping")
        return null
      }

      const fullPage = page as PageObjectResponse

      // Extract slug from properties
      const slug = this.extractSlug(fullPage.properties as NotionProperties)
      if (!slug) {
        console.warn("Page missing slug property, skipping")
        return null
      }

      // Fetch blocks for the page
      const blocks = await this.fetchPageBlocks(fullPage.id)

      // Convert blocks to markdown
      const content = this.blocksToMarkdown.convert(blocks)

      // Map properties to frontmatter
      const mapper = this.getPropertyMapper(directory)
      const frontmatter = mapper.mapToFrontmatter(fullPage.properties as NotionProperties) as F

      return {
        slug,
        frontmatter,
        content,
      }
    } catch (error) {
      console.error("Error mapping page to raw content:", error)
      return null
    }
  }

  /**
   * Fetches all blocks for a page
   */
  private async fetchPageBlocks(pageId: string): Promise<BlockObjectResponse[]> {
    const blocks: BlockObjectResponse[] = []
    let cursor: string | undefined = undefined

    do {
      const response = await this.client.blocks.children.list({
        block_id: pageId,
        start_cursor: cursor,
      })

      blocks.push(...(response.results.filter((block): block is BlockObjectResponse => "type" in block)))
      cursor = response.has_more ? response.next_cursor ?? undefined : undefined
    } while (cursor)

    return blocks
  }

  /**
   * Extracts slug from page properties
   */
  private extractSlug(properties: NotionProperties): string | null {
    const slugProperty = properties["Slug"] ?? properties["slug"]
    if (slugProperty?.type === "rich_text" && slugProperty.rich_text.length > 0) {
      return slugProperty.rich_text[0].plain_text
    }
    return null
  }
}
