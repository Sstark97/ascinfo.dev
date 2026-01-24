import { SCHEMA_CONTEXT, AUTHOR, SITE_URL } from "../constants"

export class ProfilePageSchemaBuilder {
  static build() {
    return {
      "@context": SCHEMA_CONTEXT,
      "@type": "ProfilePage",
      dateCreated: "2024-01-01",
      dateModified: new Date().toISOString().split('T')[0],
      mainEntity: {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: AUTHOR.name,
        alternateName: AUTHOR.alternateName[0],
        identifier: AUTHOR.identifier,
        description: AUTHOR.description,
        image: AUTHOR.image,
        sameAs: AUTHOR.socialLinks
      }
    }
  }
}
