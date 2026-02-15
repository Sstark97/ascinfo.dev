import { ImageResponse } from "next/og"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image(): Promise<ImageResponse> {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1a1a1a",
          padding: "60px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Main Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* Main Title */}
          <div
            style={{
              fontSize: 72,
              fontWeight: "bold",
              color: "white",
              marginBottom: 24,
            }}
          >
            Aitor Santana Cabrera
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 36,
              color: "#FCA311",
              fontWeight: "600",
            }}
          >
            Software Crafter | Clean Code | TDD
          </div>
        </div>

        {/* Branding */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 60,
            fontSize: 24,
            color: "#666666",
          }}
        >
          ascinfo.dev
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
