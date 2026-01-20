export class PlainTextContent {
  private constructor(private readonly value: string) {}

  static fromMarkdown(markdown: string): PlainTextContent {
    const plain = markdown
      .replace(/```[\s\S]*?```/g, "")      // Remove code blocks
      .replace(/`([^`]+)`/g, "$1")         // Remove inline code backticks but keep content
      .replace(/#{1,6}\s/g, "")            // Remove heading syntax
      .replace(/\*\*([^*]+)\*\*/g, "$1")   // Remove bold
      .replace(/\*([^*]+)\*/g, "$1")       // Remove italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Extract link text
      .replace(/<[^>]+>/g, "")             // Remove HTML/JSX
      .replace(/\n{3,}/g, "\n\n")          // Normalize whitespace
      .trim()

    return new PlainTextContent(plain)
  }

  toString(): string {
    return this.value
  }
}
