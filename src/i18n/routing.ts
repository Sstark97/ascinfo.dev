import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/blog': { es: '/blog', en: '/blog' },
    '/blog/[slug]': { es: '/blog/[slug]', en: '/blog/[slug]' },
    '/proyectos': { es: '/proyectos', en: '/projects' },
    '/proyectos/[slug]': { es: '/proyectos/[slug]', en: '/projects/[slug]' },
    '/charlas': { es: '/charlas', en: '/talks' },
    '/charlas/[slug]': { es: '/charlas/[slug]', en: '/talks/[slug]' },
    '/sobre-mi': { es: '/sobre-mi', en: '/about' },
  },
})

export type Pathnames = keyof typeof routing.pathnames
export type Locale = (typeof routing.locales)[number]
