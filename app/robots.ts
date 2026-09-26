import type { MetadataRoute } from "next";
import { getPublicContent, publicSiteUrl } from "@/lib/site-settings";
export default async function robots(): Promise<MetadataRoute.Robots> { const { settings } = await getPublicContent(); const base = publicSiteUrl(settings); return { rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }], sitemap: `${base}/sitemap.xml` }; }
