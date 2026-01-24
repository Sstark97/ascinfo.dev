import { SCHEMA_CONTEXT, SITE_URL } from "../constants"

type BreadcrumbItem = {
  name: string
  item?: string
}

export class BreadcrumbSchemaBuilder {
  static build(items: BreadcrumbItem[]) {
    return {
      "@context": SCHEMA_CONTEXT,
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        ...(item.item && { item: item.item })
      }))
    }
  }

  static forBlogPost(title: string, slug: string) {
    return this.build([
      { name: "Inicio", item: SITE_URL },
      { name: "Blog", item: `${SITE_URL}/blog` },
      { name: title }
    ])
  }

  static forProject(title: string) {
    return this.build([
      { name: "Inicio", item: SITE_URL },
      { name: "Proyectos", item: `${SITE_URL}/proyectos` },
      { name: title }
    ])
  }

  static forTalk(title: string) {
    return this.build([
      { name: "Inicio", item: SITE_URL },
      { name: "Charlas", item: `${SITE_URL}/charlas` },
      { name: title }
    ])
  }
}
