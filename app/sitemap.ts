import type { MetadataRoute } from "next"
import { posts, projects, talks } from "@/src/lib/content"

const siteUrl = "https://ascinfo.dev"

function withAlternates(esUrl: string, enUrl: string) {
  return {
    alternates: {
      languages: {
        es: `${siteUrl}${esUrl}`,
        en: `${siteUrl}${enUrl}`,
        "x-default": `${siteUrl}${esUrl}`,
      },
    },
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [allPostsEs, allProjectsEs, allTalksEs] = await Promise.all([
    posts.getAll.execute("es"),
    projects.getAll.execute("es"),
    talks.getAll.execute("es"),
  ])

  const postEntries: MetadataRoute.Sitemap = allPostsEs.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.lastModified),
    changeFrequency: "monthly",
    priority: 0.7,
    ...withAlternates(`/blog/${post.slug}`, `/en/blog/${post.slug}`),
  }))

  const projectEntries: MetadataRoute.Sitemap = allProjectsEs.map((project) => ({
    url: `${siteUrl}/proyectos/${project.slug}`,
    lastModified: project.lastCommit ? new Date(project.lastCommit) : new Date("2023-04-11T00:00:00Z"),
    changeFrequency: "monthly",
    priority: 0.6,
    ...withAlternates(`/proyectos/${project.slug}`, `/en/projects/${project.slug}`),
  }))

  const talkEntries: MetadataRoute.Sitemap = allTalksEs.map((talk) => ({
    url: `${siteUrl}/charlas/${talk.slug}`,
    lastModified: new Date(talk.date),
    changeFrequency: "yearly",
    priority: 0.6,
    ...withAlternates(`/charlas/${talk.slug}`, `/en/talks/${talk.slug}`),
  }))

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date("2026-02-01T00:00:00Z"),
      changeFrequency: "monthly",
      priority: 1,
      ...withAlternates("/", "/en"),
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date("2026-02-01T00:00:00Z"),
      changeFrequency: "weekly",
      priority: 0.9,
      ...withAlternates("/blog", "/en/blog"),
    },
    {
      url: `${siteUrl}/proyectos`,
      lastModified: new Date("2026-02-01T00:00:00Z"),
      changeFrequency: "monthly",
      priority: 0.8,
      ...withAlternates("/proyectos", "/en/projects"),
    },
    {
      url: `${siteUrl}/charlas`,
      lastModified: new Date("2026-02-01T00:00:00Z"),
      changeFrequency: "monthly",
      priority: 0.8,
      ...withAlternates("/charlas", "/en/talks"),
    },
    {
      url: `${siteUrl}/sobre-mi`,
      lastModified: new Date("2026-02-01T00:00:00Z"),
      changeFrequency: "monthly",
      priority: 0.8,
      ...withAlternates("/sobre-mi", "/en/about"),
    },
  ]

  return [...staticRoutes, ...postEntries, ...projectEntries, ...talkEntries]
}
