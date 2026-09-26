import Link from "next/link";
import type { SiteSettings } from "@/types/conference";

export default function Footer({ settings }: { settings: SiteSettings }) {
  const { conference } = settings;
  return <footer id="contact" className="scroll-mt-10 bg-[var(--night)] text-white">
    <div className="site-container grid gap-12 py-16 md:grid-cols-2 md:items-end">
      <div><p className="eyebrow text-[var(--blue-light)]">Contact</p><h2 className="mt-3 max-w-xl font-display text-5xl leading-none sm:text-6xl">See you in Izmir.</h2><p className="mt-6 max-w-lg text-white/62">{conference.dates} · {conference.location.venue}</p></div>
      <div className="flex flex-col items-start gap-3 md:items-end">
        {conference.contactEmail.includes("@") ? <Link className="link-underline text-lg font-bold hover:text-[var(--blue-light)]" href={`mailto:${conference.contactEmail}`}>{conference.contactEmail}</Link> : <p className="text-sm text-white/62">{conference.contactEmail}</p>}
        <Link className="link-underline text-sm text-white/78 hover:text-white" href={conference.instagramUrl} target="_blank" rel="noreferrer">{conference.instagramHandle}</Link>
        <p className="mt-5 text-xs uppercase tracking-[.15em] text-white/42">Website by <Link className="hover:text-white" href="https://www.instagram.com/emre.bozqurt/" target="_blank" rel="noreferrer">Emre Bozkurt</Link></p>
      </div>
    </div>
  </footer>;
}
