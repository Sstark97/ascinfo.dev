import type { MetadataRoute } from "next"
import { posts, projects, talks } from "@/src/lib/content"

const siteUrl = "https://ascinfo.dev"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Obtener todos los posts
  const allPosts = await posts.getAll.execute()
  const postEntries: MetadataRoute.Sitemap = allPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  // Obtener todos los proyectos
  const allProjects = await projects.getAll.execute()
  const projectEntries: MetadataRoute.Sitemap = allProjects.map((project) => ({
    url: `${siteUrl}/proyectos/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  // Obtener todas las charlas
  const allTalks = await talks.getAll.execute()
  const talkEntries: MetadataRoute.Sitemap = allTalks.map((talk) => ({
    url: `${siteUrl}/charlas/${talk.slug}`,
    lastModified: new Date(talk.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }))

  // Rutas estáticas
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/proyectos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/charlas`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ]

  return [...staticRoutes, ...postEntries, ...projectEntries, ...talkEntries]
}
