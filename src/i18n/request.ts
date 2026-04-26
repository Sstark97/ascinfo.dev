import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'
import { notFound } from 'next/navigation'

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale

  if (!locale || !routing.locales.includes(locale as 'es' | 'en')) {
    notFound()
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
