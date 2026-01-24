import { SCHEMA_CONTEXT, AUTHOR, SITE_URL, LANGUAGE } from "../constants"

export class WebSiteSchemaBuilder {
  static build() {
    return {
      "@context": SCHEMA_CONTEXT,
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Aitor Santana | Software Crafter",
      alternateName: ["ascinfo.dev", "ascinfo"],
      url: SITE_URL,
      description: "Blog y portfolio de Aitor Santana sobre TDD, Clean Code e IA",
      publisher: { "@id": `${SITE_URL}/#person` },
      inLanguage: LANGUAGE
    }
  }
}
