import type { BlogSchema } from "../domain/types"
import { SCHEMA_CONTEXT, SITE_URL, AUTHOR, LANGUAGE } from "../constants"

export class BlogSchemaBuilder {
  static build(): BlogSchema {
    return {
      "@context": SCHEMA_CONTEXT,
      "@type": "Blog",
      name: "Blog de Aitor Santana",
      description:
        "Artículos sobre desarrollo de software, TDD, Clean Code, arquitectura hexagonal y buenas prácticas de programación.",
      url: `${SITE_URL}/blog`,
      author: {
        "@context": SCHEMA_CONTEXT,
        "@type": "Person",
        name: AUTHOR.name,
        url: AUTHOR.url,
      },
      inLanguage: LANGUAGE,
    }
  }
}
