import type { Talk } from "@/src/lib/content/domain/entities/Talk"
import type { JsonLdSchema } from "../domain/types"
import { SCHEMA_CONTEXT, AUTHOR } from "../constants"

export interface VideoObjectSchema extends JsonLdSchema {
  "@type": "VideoObject"
  name: string
  description: string
  thumbnailUrl: string
  uploadDate: string
  contentUrl: string
  embedUrl: string
  performer: {
    "@type": "Person"
    name: string
    url: string
  }
}

export class VideoSchemaBuilder {
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

  /**
   * Builds a VideoObject schema for a talk
   * @param talk - Talk entity with video URL
   * @returns VideoObject schema or null if no video URL
   */
  static build(talk: Talk): VideoObjectSchema | null {
    if (!talk.videoUrl) {
      return null
    }

    const youtubeId = this.extractYouTubeId(talk.videoUrl)
    const thumbnailUrl = youtubeId
      ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
      : AUTHOR.image

    const embedUrl = youtubeId
      ? `https://www.youtube.com/embed/${youtubeId}`
      : talk.videoUrl

    return {
      "@context": SCHEMA_CONTEXT,
      "@type": "VideoObject",
      name: talk.title,
      description: talk.description || talk.title,
      thumbnailUrl,
      uploadDate: talk.date,
      contentUrl: talk.videoUrl,
      embedUrl,
      performer: {
        "@type": "Person",
        name: AUTHOR.name,
        url: AUTHOR.url,
      },
    }
  }
}
