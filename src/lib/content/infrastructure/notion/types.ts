import type {
  BlockObjectResponse,
  PageObjectResponse,
  PartialBlockObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints"

export type NotionDatabaseId = string

export type NotionPage = PageObjectResponse | PartialPageObjectResponse

export type NotionBlock = BlockObjectResponse | PartialBlockObjectResponse

export type DatabaseMapping = Record<string, NotionDatabaseId>

// Property value types based on Notion API
export type NotionPropertyValue =
  | { type: "title"; title: Array<{ plain_text: string }> }
  | { type: "rich_text"; rich_text: Array<{ plain_text: string }> }
  | { type: "multi_select"; multi_select: Array<{ name: string }> }
  | { type: "checkbox"; checkbox: boolean }
  | { type: "date"; date: { start: string } | null }
  | { type: "select"; select: { name: string } | null }
  | { type: "number"; number: number | null }
  | { type: "url"; url: string | null }

// Helper types for extracting property values
export type NotionProperties = Record<string, NotionPropertyValue>

// Rich text type from Notion API
export type NotionRichText = {
  type: string
  plain_text: string
  href?: string | null
  annotations?: {
    bold?: boolean
    italic?: boolean
    strikethrough?: boolean
    underline?: boolean
    code?: boolean
    color?: string
  }
}

// Type guard to check if a block is a full BlockObjectResponse
export function isFullBlock(block: NotionBlock): block is BlockObjectResponse {
  return "type" in block && block.type !== undefined
}

// Type guard to check if a page is a full PageObjectResponse
export function isFullPage(page: NotionPage): page is PageObjectResponse {
  return "properties" in page
}
