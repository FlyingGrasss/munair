import type { Metadata } from "next";
import type { SiteSettings } from "@/types/conference";
import { publicSiteUrl } from "@/lib/site-settings";

export const SOCIAL_IMAGE_PATH = "/icon.png";
export const SOCIAL_IMAGE_WIDTH = 640;
export const SOCIAL_IMAGE_HEIGHT = 640;

export function absoluteSiteUrl(settings: SiteSettings, value: string) {
  const base = publicSiteUrl(settings);

  try {
    return new URL(value, `${base}/`).toString();
  } catch {
    return `${base}${value.startsWith("/") ? value : `/${value}`}`;
  }
}

export function cleanMetadataText(value: string, maxLength = 170) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 3).trim()}...`;
}

export function pageMetadata({
  settings,
  title,
  description,
  path,
  imagePath = SOCIAL_IMAGE_PATH,
  imageAlt,
  noIndex = false,
}: {
  settings: SiteSettings;
  title: string;
  description: string;
  path: string;
  imagePath?: string;
  imageAlt?: string;
  noIndex?: boolean;
}): Metadata {
  const siteUrl = publicSiteUrl(settings);
  const url = absoluteSiteUrl(settings, path);
  const descriptionText = cleanMetadataText(description);
  const imageUrl = absoluteSiteUrl(settings, imagePath);
  const conference = settings.conference;

  return {
    title,
    description: descriptionText,
    alternates: { canonical: path },
    openGraph: {
      title,
      description: descriptionText,
      url,
      siteName: conference.displayName,
      images: [{
        url: imageUrl,
        width: SOCIAL_IMAGE_WIDTH,
        height: SOCIAL_IMAGE_HEIGHT,
        alt: imageAlt || `${conference.displayName} - ${conference.fullName}`,
      }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: descriptionText,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    metadataBase: new URL(siteUrl),
  };
}
