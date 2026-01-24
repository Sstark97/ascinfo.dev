export const SITE_URL = "https://ascinfo.dev"

export const AUTHOR = {
  name: "Aitor Santana Cabrera",
  alternateName: ["Aitor Santana", "ascinfo"],
  identifier: "aitor-santana",
  description: "Software Crafter, desarrollador FullStack y Technical Writer especializado en TDD, Clean Architecture, Clean Code e Inteligencia Artificial Generativa.",
  url: SITE_URL,
  image: `${SITE_URL}/aitor_profile.webp`,
  twitter: "@aitorsci",
  jobTitle: "Software Developer",
  company: {
    name: "Lean Mind",
    url: "https://leanmind.es"
  },
  socialLinks: [
    "https://www.linkedin.com/in/aitorscinfo/",
    "https://github.com/Sstark97",
    "https://twitter.com/aitorsci",
    "https://bsky.app/profile/ascinfo.dev"
  ],
  skills: [
    "TDD", "Test-Driven Development",
    "Clean Code", "Código Limpio",
    "Software Craftsmanship", "Software Crafter",
    "Inteligencia Artificial", "IA", "AI", "Generative AI",
    "DDD", "Domain-Driven Design",
    "Arquitectura Hexagonal", "Clean Architecture",
    "TypeScript", "React", "Next.js", "Rust", "Java"
  ]
} as const

export const SCHEMA_CONTEXT = "https://schema.org" as const
export const LANGUAGE = "es-ES" as const
