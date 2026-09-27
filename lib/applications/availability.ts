import type { SiteSettings } from "@/types/conference";
import { isSafeDocumentUrl } from "../documents.ts";

export function getApplicationsDestination(settings: SiteSettings) {
  if (!settings.applicationsClosed) return "/#applications";
  const destination = settings.applicationsClosedUrl.trim();
  return isSafeDocumentUrl(destination) ? destination : "/#applications";
}

export function getApplicationHref(settings: SiteSettings, applicationId: string) {
  return settings.applicationsClosed ? getApplicationsDestination(settings) : `/apply/${applicationId}`;
}
