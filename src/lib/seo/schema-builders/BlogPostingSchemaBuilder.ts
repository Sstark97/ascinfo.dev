import type { BlogPostingSchema } from "../domain/types"
import type { Post } from "@/src/lib/content/domain/entities/Post"
import { SCHEMA_CONTEXT, SITE_URL, AUTHOR, LANGUAGE } from "../constants"

export class BlogPostingSchemaBuilder {
  static build(post: Post): BlogPostingSchema {
    return {
      "@context": SCHEMA_CONTEXT,
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      image: AUTHOR.image,
      datePublished: post.date,
      dateModified: post.date,
      author: {
        "@context": SCHEMA_CONTEXT,
        "@type": "Person",
        name: AUTHOR.name,
        url: AUTHOR.url,
      },
      publisher: {
        "@context": SCHEMA_CONTEXT,
        "@type": "Person",
        name: AUTHOR.name,
        url: AUTHOR.url,
        logo: {
          "@type": "ImageObject",
          url: AUTHOR.image,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${SITE_URL}/blog/${post.slug}`,
      },
      keywords: post.tags.join(", "),
      articleSection: post.tags[0] ?? "Blog",
      inLanguage: LANGUAGE,
    }
  }
}
