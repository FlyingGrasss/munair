import type { MetadataRoute } from "next";
import { getPublicContent, publicSiteUrl } from "@/lib/site-settings";
import { absoluteSiteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { settings, committees, team } = await getPublicContent();
  const base = publicSiteUrl(settings);
  const entries: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "yearly", priority: 1 },
  ];

  if (settings.sections.committees) {
    entries.push(...committees.map((committee) => ({
      url: `${base}/committees/${committee.slug}`,
      lastModified: new Date(committee.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      ...(committee.imageUrl ? { images: [absoluteSiteUrl(settings, committee.imageUrl)] } : {}),
    })));
  }

  if (settings.sections.team) {
    entries.push(...team.map((member) => ({
      url: `${base}/team/${member.slug}`,
      lastModified: new Date(member.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      ...(member.imageUrl ? { images: [absoluteSiteUrl(settings, member.imageUrl)] } : {}),
    })));
  }

  if (settings.sections.applications && !settings.applicationsClosed) {
    entries.push(...settings.applications.filter((application) => application.enabled && !application.externalLinkEnabled).map((application) => ({
      url: `${base}/apply/${application.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })));
  }

  return entries;
}
