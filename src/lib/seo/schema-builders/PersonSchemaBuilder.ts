import type { PersonSchema } from "../domain/types"
import { SCHEMA_CONTEXT, AUTHOR } from "../constants"

export class PersonSchemaBuilder {
  static build(): PersonSchema {
    return {
      "@context": SCHEMA_CONTEXT,
      "@type": "Person",
      name: AUTHOR.name,
      url: AUTHOR.url,
      image: AUTHOR.image,
      jobTitle: AUTHOR.jobTitle,
      worksFor: {
        "@type": "Organization",
        name: AUTHOR.company,
      },
      sameAs: AUTHOR.socialLinks,
      knowsAbout: AUTHOR.skills,
    }
  }
}
