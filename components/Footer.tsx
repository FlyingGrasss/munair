import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { SiteSettings } from "@/types/conference";

export default function Footer({ settings }: { settings: SiteSettings }) {
  const { conference } = settings;
  return (
    <footer id="contact" className="site-footer">
      <div className="site-container">
        <div className="footer-callout">
          <p>{conference.hashtag}</p>
          <h2>See you<br />above the clouds.</h2>
        </div>
        <div className="footer-routes">
          <div><span>Follow</span><Link href={conference.instagramUrl} target="_blank" rel="noreferrer">{conference.instagramHandle} <ArrowUpRight aria-hidden="true" /></Link></div>
          <div><span>Contact</span><Link href={`mailto:${conference.contactEmail}`}>{conference.contactEmail} <ArrowUpRight aria-hidden="true" /></Link></div>
          <div><span>Location</span><p>İzmir, Türkiye</p></div>
        </div>
        <div className="footer-base"><span>MUNAIR’27 · Est. 2025</span><span>Website by <Link href="https://www.instagram.com/emre.bozqurt/" target="_blank" rel="noreferrer">@emre.bozqurt</Link></span></div>
      </div>
    </footer>
  );
}
