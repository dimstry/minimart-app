import type { MetadataRoute } from "next"
import { SITE } from "@/lib/utils"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE}/login`, changeFrequency: "yearly", priority: 0.5 },
  ]
}
