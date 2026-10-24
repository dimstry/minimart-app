import { ImageResponse } from "next/og"
import { LogoMark } from "@/components/logo"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

// Ikon layar utama iOS: tanpa sudut membulat, iOS yang membulatkan sendiri.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#18181b" }}>
        <LogoMark size={180} />
      </div>
    ),
    size,
  )
}
