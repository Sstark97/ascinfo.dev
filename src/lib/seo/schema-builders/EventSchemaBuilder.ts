import type { EventSchema } from "../domain/types"
import type { Talk } from "@/src/lib/content/domain/entities/Talk"
import { SCHEMA_CONTEXT, SITE_URL, AUTHOR, LANGUAGE } from "../constants"

export class EventSchemaBuilder {
  /**
   * Extracts YouTube video ID from various YouTube URL formats
   * @param url - YouTube URL (youtu.be or youtube.com)
   * @returns Video ID or empty string if not found
   */
  private static extractYouTubeId(url: string): string {
    // youtu.be/VIDEO_ID?si=xxx
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
    if (shortMatch) return shortMatch[1]

    // youtube.com/watch?v=VIDEO_ID
    const longMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
    if (longMatch) return longMatch[1]

    return ""
  }

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
      const youtubeId = this.extractYouTubeId(talk.videoUrl)
      const thumbnailUrl = youtubeId
        ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
        : AUTHOR.image

      schema.recordedIn = {
        "@type": "VideoObject",
        name: talk.title,
        description: talk.description || talk.title,
        url: talk.videoUrl,
        thumbnailUrl,
        uploadDate: talk.date,
        performer: {
          "@type": "Person",
          name: AUTHOR.name,
        },
      }
    }

    return schema
  }
}
