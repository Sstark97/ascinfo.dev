import { ImageResponse } from "next/og"
import { posts } from "@/src/lib/content"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

type RouteParams = {
  params: Promise<{ slug: string }>
}

export default async function Image({ params }: RouteParams): Promise<ImageResponse> {
  const { slug } = await params
  const post = await posts.getBySlug.execute(slug)

  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#1a1a1a",
            color: "white",
            fontSize: 48,
            fontWeight: "bold",
          }}
        >
          Post no encontrado
        </div>
      ),
      {
        ...size,
      }
    )
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#1a1a1a",
          padding: "60px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Main Content Area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
          }}
        >
          {/* Post Title */}
          <div
            style={{
              fontSize: 64,
              fontWeight: "bold",
              color: "white",
              lineHeight: 1.2,
              marginBottom: 24,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {post.title}
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                fontSize: 28,
                color: "#FCA311",
              }}
            >
              {post.tags.slice(0, 3).map((tag) => `#${tag}`).join(" ")}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 40,
          }}
        >
          {/* Author */}
          <div
            style={{
              fontSize: 32,
              color: "white",
              fontWeight: "600",
            }}
          >
            Aitor Santana
          </div>

          {/* Branding */}
          <div
            style={{
              fontSize: 24,
              color: "#666666",
            }}
          >
            ascinfo.dev
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
