import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getApplicationsDestination } from "@/lib/applications/availability";
import { getPublicContent } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Applications",
  robots: { index: false, follow: false },
};

export default async function ApplyIndex() {
  const { settings } = await getPublicContent();
  redirect(settings.applicationsClosed ? getApplicationsDestination(settings) : "/#applications");
}
