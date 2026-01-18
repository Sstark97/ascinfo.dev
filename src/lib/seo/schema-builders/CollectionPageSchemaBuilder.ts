import type { CollectionPageSchema } from "../domain/types"
import { SCHEMA_CONTEXT, SITE_URL, AUTHOR, LANGUAGE } from "../constants"

interface CollectionPageData {
  name: string
  description: string
  path: string
}

export class CollectionPageSchemaBuilder {
  static build(data: CollectionPageData): CollectionPageSchema {
    return {
      "@context": SCHEMA_CONTEXT,
      "@type": "CollectionPage",
      name: data.name,
      description: data.description,
      url: `${SITE_URL}${data.path}`,
      author: {
        "@context": SCHEMA_CONTEXT,
        "@type": "Person",
        name: AUTHOR.name,
        url: AUTHOR.url,
      },
      inLanguage: LANGUAGE,
    }
  }

  static forProjects(): CollectionPageSchema {
    return this.build({
      name: "Proyectos de Aitor Santana",
      description: "Portfolio de proyectos de software desarrollados por Aitor Santana.",
      path: "/proyectos",
    })
  }

  static forTalks(): CollectionPageSchema {
    return this.build({
      name: "Charlas de Aitor Santana",
      description:
        "Charlas y ponencias sobre desarrollo de software, TDD, Clean Code y arquitectura hexagonal.",
      path: "/charlas",
    })
  }
}
