export interface JsonLdSchema {
  "@context": string
  "@type": string
  [key: string]: unknown
}

export interface PersonSchema extends JsonLdSchema {
  "@type": "Person"
  name: string
  url: string
  image?: {
    "@type": "ImageObject"
    url: string
    width: number
    height: number
  }
  jobTitle?: string
  worksFor?: {
    "@type": "Organization"
    name: string
    url: string
  }
  sameAs?: readonly string[]
  knowsAbout?: readonly string[]
  alumniOf?: {
    "@type": "EducationalOrganization"
    name: string
  }
  homeLocation?: {
    "@type": "Place"
    address: {
      "@type": "PostalAddress"
      addressRegion: string
      addressCountry: string
    }
  }
}

export interface BlogSchema extends JsonLdSchema {
  "@type": "Blog"
  name: string
  description: string
  url: string
  author: PersonSchema
  inLanguage: string
}

export interface BlogPostingSchema extends JsonLdSchema {
  "@type": "BlogPosting"
  headline: string
  description: string
  image: string
  datePublished: string
  dateModified: string
  author: PersonSchema
  publisher: PersonSchema & {
    logo: {
      "@type": "ImageObject"
      url: string
    }
  }
  mainEntityOfPage: {
    "@type": "WebPage"
    "@id": string
  }
  keywords: string
  articleSection: string
  inLanguage: string
}

export interface CollectionPageSchema extends JsonLdSchema {
  "@type": "CollectionPage"
  name: string
  description: string
  url: string
  author: PersonSchema
  inLanguage: string
}

export interface SoftwareApplicationSchema extends JsonLdSchema {
  "@type": "SoftwareApplication"
  name: string
  description: string
  url: string
  image: string
  applicationCategory: string
  operatingSystem: string
  author: PersonSchema
  codeRepository?: string
  offers?: {
    "@type": "Offer"
    url: string
    price: string
    priceCurrency: string
  }
  keywords: string
  inLanguage: string
}

export interface EventSchema extends JsonLdSchema {
  "@type": "Event"
  name: string
  description: string
  startDate: string
  eventStatus: string
  eventAttendanceMode: string
  location: {
    "@type": "Place"
    name: string
    address: {
      "@type": "PostalAddress"
      addressLocality: string
    }
  }
  performer: PersonSchema
  organizer: {
    "@type": "Organization"
    name: string
  }
  workFeatured?: {
    "@type": "PresentationDigitalDocument"
    name: string
    url: string
  }
  recordedIn?: {
    "@type": "VideoObject"
    name: string
    url: string
  }
  keywords: string
  inLanguage: string
}
