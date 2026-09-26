import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ApplicationForm from "@/components/ApplicationForm";
import { getPublicContent } from "@/lib/site-settings";
import { isApplicationType } from "@/lib/applications/validation";
import { isAdmin } from "@/lib/admin-auth";

export const instant = false;

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params; const { settings } = await getPublicContent();
  const application = settings.applications.find((item) => item.id === type);
  return { title: application?.formTitle || "Application" };
}

export default async function ApplicationPage({ params, searchParams }: { params: Promise<{ type: string }>; searchParams: Promise<{ preview?: string }> }) {
  const { type } = await params;
  if (!isApplicationType(type)) notFound();
  const preview = (await searchParams).preview === "1" && await isAdmin();
  const { settings } = await getPublicContent();
  const application = settings.applications.find((item) => item.id === type && (item.enabled || preview));
  if (!application) notFound();
  return <div className="application-page"><div className="site-container application-page__shell">
    <div className="application-page__top"><Link href="/#applications"><ArrowLeft aria-hidden="true" /> Back to applications</Link><span>{application.title}</span></div>
    <div className="application-page__grid">
      <aside className="application-page__intro">
        <p className="eyebrow">MUNAIR’27 / Application</p>
        <h1>{application.formTitle}</h1>
        <p className="application-page__description">{application.description}</p>
        <div className="application-page__note"><span>01</span><p>Email verification is required before an application is submitted.</p></div>
      </aside>
      <section className="application-page__form" aria-label={application.formTitle}><ApplicationForm application={application} settings={settings} /></section>
    </div>
  </div></div>;
}
