import type { SoftwareApplicationSchema } from "../domain/types"
import type { Project } from "@/src/lib/content/domain/entities/Project"
import { SCHEMA_CONTEXT, SITE_URL, AUTHOR, LANGUAGE } from "../constants"

export class SoftwareApplicationSchemaBuilder {
  static build(project: Project): SoftwareApplicationSchema {
    const imageUrl = project.heroImage
      ? project.heroImage.startsWith("http")
        ? project.heroImage
        : `${SITE_URL}${project.heroImage}`
      : `${SITE_URL}/og-image.png`

    const schema: SoftwareApplicationSchema = {
      "@context": SCHEMA_CONTEXT,
      "@type": "SoftwareApplication",
      name: project.title,
      description: project.description,
      url: `${SITE_URL}/proyectos/${project.slug}`,
      image: imageUrl,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      author: {
        "@context": SCHEMA_CONTEXT,
        "@type": "Person",
        name: AUTHOR.name,
        url: AUTHOR.url,
      },
      keywords: project.tags.join(", "),
      inLanguage: LANGUAGE,
    }

    if (project.repoUrl) {
      schema.codeRepository = project.repoUrl
    }

    if (project.demoUrl) {
      schema.offers = {
        "@type": "Offer",
        url: project.demoUrl,
        price: "0",
        priceCurrency: "EUR",
      }
    }

    return schema
  }
}
