import type { PersonSchema } from "../domain/types"
import { SCHEMA_CONTEXT, AUTHOR, SITE_URL } from "../constants"

export class PersonSchemaBuilder {
  static build(): PersonSchema {
    return {
      "@context": SCHEMA_CONTEXT,
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: AUTHOR.name,
      alternateName: AUTHOR.alternateName,
      description: AUTHOR.description,
      url: AUTHOR.url,
      image: {
        "@type": "ImageObject",
        url: AUTHOR.image,
        width: 400,
        height: 400
      },
      jobTitle: AUTHOR.jobTitle,
      worksFor: {
        "@type": "Organization",
        name: AUTHOR.company.name,
        url: AUTHOR.company.url
      },
      sameAs: AUTHOR.socialLinks,
      knowsAbout: AUTHOR.skills,
      alumniOf: {
        "@type": "EducationalOrganization",
        name: "Universidad de Las Palmas de Gran Canaria"
      },
      homeLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressRegion: "Canarias",
          addressCountry: "ES"
        }
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": SITE_URL
      }
    }
  }
}
