const MAX_TITLE_LENGTH = 60
const MAX_DESCRIPTION_LENGTH = 155

export class SeoMetadata {
  private constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly focusKeyword?: string
  ) {}

  static create(
    title: string | undefined,
    description: string | undefined,
    focusKeyword?: string
  ): SeoMetadata {
    return new SeoMetadata(
      title ? SeoMetadata.truncateTitle(title) : '',
      description ? SeoMetadata.truncateDescription(description) : '',
      focusKeyword
    )
  }

  private static truncateTitle(title: string): string {
    if (title.length <= MAX_TITLE_LENGTH) return title
    const truncated = title.slice(0, MAX_TITLE_LENGTH - 3)
    const lastSpace = truncated.lastIndexOf(' ')
    return lastSpace > 0 ? `${truncated.slice(0, lastSpace)}...` : `${truncated}...`
  }

  private static truncateDescription(description: string): string {
    if (description.length <= MAX_DESCRIPTION_LENGTH) return description
    const truncated = description.slice(0, MAX_DESCRIPTION_LENGTH - 3)
    const lastSpace = truncated.lastIndexOf(' ')
    return lastSpace > 0 ? `${truncated.slice(0, lastSpace)}...` : `${truncated}...`
  }

  isEmpty(): boolean {
    return this.title === '' && this.description === '' && !this.focusKeyword
  }
}
