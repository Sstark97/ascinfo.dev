import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/_next/"] },
      { userAgent: "Googlebot", allow: "/" }
    ],
    sitemap: "https://ascinfo.dev/sitemap.xml",
    host: "https://ascinfo.dev"
  }
}
