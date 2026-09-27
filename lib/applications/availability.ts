import type { SiteSettings } from "@/types/conference";
import { isSafeDocumentUrl } from "../documents.ts";

export function getApplicationsDestination() {
  return "/#applications";
}

export function getExternalApplicationDestination(settings: SiteSettings, applicationId: string) {
  if (settings.applicationsClosed) return null;
  const application = settings.applications.find((item) => item.id === applicationId);
  if (!application?.externalLinkEnabled) return null;
  const destination = application.externalUrl.trim();
  return isSafeDocumentUrl(destination) ? destination : null;
}

export function getApplicationHref(settings: SiteSettings, applicationId: string) {
  return settings.applicationsClosed
    ? getApplicationsDestination()
    : getExternalApplicationDestination(settings, applicationId) ?? `/apply/${applicationId}`;
}
