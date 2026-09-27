import type { SiteSettings } from "@/types/conference";
import { absoluteSiteUrl, SOCIAL_IMAGE_PATH } from "@/lib/seo";
import { publicSiteUrl } from "@/lib/site-settings";

export default function StructuredData({ settings }: { settings: SiteSettings }) {
  const siteUrl = publicSiteUrl(settings);
  const conference = settings.conference;
  const organizationName = conference.organizer.name || conference.brandName;
  const location = {
    "@type": "Place",
    name: conference.location.venue,
    address: {
      "@type": "PostalAddress",
      addressLocality: conference.location.city,
      addressCountry: conference.location.country,
    },
  };
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Event",
        "@id": `${siteUrl}/#event`,
        name: `${conference.displayName} | ${conference.fullName}`,
        description: `${conference.sessionName}. ${conference.dates}.`,
        url: siteUrl,
        startDate: conference.startDateIso,
        ...(conference.endDateIso ? { endDate: conference.endDateIso } : {}),
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        image: [absoluteSiteUrl(settings, SOCIAL_IMAGE_PATH)],
        location,
        organizer: {
          "@type": "Organization",
          name: organizationName,
          url: siteUrl,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: conference.displayName,
        description: `${conference.sessionName}. Join us on ${conference.dates}.`,
        inLanguage: "en-US",
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: organizationName,
        description: conference.fullName,
        url: siteUrl,
        logo: absoluteSiteUrl(settings, SOCIAL_IMAGE_PATH),
        sameAs: conference.instagramUrl ? [conference.instagramUrl] : [],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
    />
  );
}
