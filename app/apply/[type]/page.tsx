import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ApplicationForm from "@/components/ApplicationForm";
import { getPublicContent } from "@/lib/site-settings";
import { pageMetadata } from "@/lib/seo";
import { isApplicationType } from "@/lib/applications/validation";
import { isAdmin } from "@/lib/admin-auth";
import { getApplicationHref, getExternalApplicationDestination, getApplicationsDestination } from "@/lib/applications/availability";

export const instant = false;

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params; const { settings } = await getPublicContent();
  const application = settings.applications.find((item) => item.id === type);
  if (!application) return { title: "Application", robots: { index: false, follow: false } };

  if (settings.applicationsClosed || getExternalApplicationDestination(settings, type)) return { title: "Application unavailable", robots: { index: false, follow: false } };

  return pageMetadata({
    settings,
    title: application.formTitle,
    description: `${application.description} Apply to join ${settings.conference.displayName}.`,
    path: `/apply/${application.id}`,
    imageAlt: `${settings.conference.displayName} application`,
    noIndex: !application.enabled,
  });
}

export default async function ApplicationPage({ params, searchParams }: { params: Promise<{ type: string }>; searchParams: Promise<{ preview?: string }> }) {
  const { type } = await params;
  if (!isApplicationType(type)) notFound();
  const preview = (await searchParams).preview === "1" && await isAdmin();
  const { settings } = await getPublicContent();
  if (settings.applicationsClosed && !preview) redirect(getApplicationsDestination());
  const application = settings.applications.find((item) => item.id === type && (item.enabled || preview));
  if (!application) notFound();
  if (!preview) {
    const externalHref = getExternalApplicationDestination(settings, type);
    if (externalHref) redirect(getApplicationHref(settings, type));
  }
  return <main className="application-page"><div className="site-container application-page__shell">
    <div className="application-page__top"><Link href="/#applications"><ArrowLeft aria-hidden="true" /> Back to applications</Link><span>{application.title}</span></div>
    <div className="application-page__hero">
      <div className="application-page__intro">
        <p className="eyebrow">MUNAIR&rsquo;27 / Application</p>
        <h1>{application.formTitle}</h1>
        <p className="application-page__description">{application.description}</p>
      </div>
      <aside className="application-page__route" aria-label="Application route">
        <span>Application route</span>
        <strong>{application.title}</strong>
        <p>Complete the details below. Your application is reviewed by the MUNAIR team.</p>
      </aside>
    </div>
    <section className="application-page__form" aria-label={application.formTitle}>
      <div className="application-page__form-heading"><span>Application details</span><p>Tell us how you would contribute to the session.</p></div>
      <ApplicationForm application={application} settings={settings} />
    </section>
  </div></main>;
}
