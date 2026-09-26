import type { SiteSettings } from "@/types/conference";

export default function StructuredData({ settings }: { settings: SiteSettings }) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.conference.brandName,
    description: settings.conference.fullName,
    url: settings.conference.siteUrl,
    sameAs: [settings.conference.instagramUrl],
    location: { "@type": "Place", name: settings.conference.location.venue, address: `${settings.conference.location.city}, ${settings.conference.location.country}` },
  };
  const data = settings.conference.startDateIso ? {
    "@context": "https://schema.org",
    "@type": "Event",
    name: settings.conference.displayName,
    description: settings.conference.sessionName,
    startDate: settings.conference.startDateIso,
    endDate: settings.conference.endDateIso || undefined,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: organization.location,
    organizer: { "@type": "Organization", name: settings.conference.organizer.name },
  } : organization;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replaceAll("<", "\\u003c") }} />;
}
