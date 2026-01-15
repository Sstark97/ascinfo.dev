import type { MetadataRoute } from "next"
import { postRepository } from "@/src/lib/content"
import { projectRepository } from "@/src/lib/content"
import { talkRepository } from "@/src/lib/content"

const siteUrl = "https://ascinfo.dev"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Obtener todos los posts
  const posts = await postRepository.getAll()
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  // Obtener todos los proyectos
  const projects = await projectRepository.getAll()
  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteUrl}/proyectos/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  // Obtener todas las charlas
  const talks = await talkRepository.getAll()
  const talkEntries: MetadataRoute.Sitemap = talks.map((talk) => ({
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
