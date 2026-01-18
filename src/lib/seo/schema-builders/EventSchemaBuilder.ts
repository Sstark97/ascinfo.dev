import type { EventSchema } from "../domain/types"
import type { Talk } from "@/src/lib/content/domain/entities/Talk"
import { SCHEMA_CONTEXT, SITE_URL, AUTHOR, LANGUAGE } from "../constants"

export class EventSchemaBuilder {
  static build(talk: Talk): EventSchema {
    const isOnline = talk.location.toLowerCase().includes("online")

    const schema: EventSchema = {
      "@context": SCHEMA_CONTEXT,
      "@type": "Event",
      name: talk.title,
      description: talk.description ?? "",
      startDate: talk.date,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: isOnline
        ? "https://schema.org/OnlineEventAttendanceMode"
        : "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: talk.location,
        address: {
          "@type": "PostalAddress",
          addressLocality: talk.location,
        },
      },
      performer: {
        "@context": SCHEMA_CONTEXT,
        "@type": "Person",
        name: AUTHOR.name,
        url: AUTHOR.url,
      },
      organizer: {
        "@type": "Organization",
        name: talk.event,
      },
      keywords: talk.tags.join(", "),
      inLanguage: LANGUAGE,
    }

    if (talk.slidesUrl) {
      schema.workFeatured = {
        "@type": "PresentationDigitalDocument",
        name: `${talk.title} - Diapositivas`,
        url: talk.slidesUrl,
      }
    }

    if (talk.videoUrl) {
      schema.recordedIn = {
        "@type": "VideoObject",
        name: `${talk.title} - Video`,
        url: talk.videoUrl,
      }
    }

    return schema
  }
}
