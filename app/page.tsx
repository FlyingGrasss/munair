import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, CalendarDays, MapPin, Plane, RadioTower } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import StructuredData from "@/components/StructuredData";
import { formatConferenceText } from "@/config/conference";
import { getPublicContent } from "@/lib/site-settings";
import { cn } from "@/lib/utils";

const MAPS_URL = "https://maps.app.goo.gl/ZDZUrWwZVSbF21ki8";

function SectionHeading({ code, label, children, inverse = false }: { code: string; label: string; children: React.ReactNode; inverse?: boolean }) {
  return (
    <div className="section-heading">
      <div className="section-heading__meta"><span>{code}</span><span>{label}</span></div>
      <h2 className={cn("section-heading__title", inverse && "text-white")}>{children}</h2>
    </div>
  );
}

export default async function Home() {
  const { settings, committees, team } = await getPublicContent();
  const { conference } = settings;
  const place = `${conference.location.venue}, ${conference.location.city}`;

  return (
    <>
      <StructuredData settings={settings} />
      <section id="top" className="munair-hero">
        <div className="hero-grid site-container">
          <div className="hero-copy"><FadeIn delay={60}>
            <div className="hero-kicker"><span>Session 03</span><span>Est. 2025</span><span>İzmir</span></div>
            <h1 className="hero-title"><span>MUN</span><span className="hero-title__air">AIR</span><sup>’27</sup></h1>
            <p className="hero-deck">A conference shaped by the precision of aviation and the open horizons of diplomacy.</p>
            <div className="hero-actions">
              <Link href="#committees" className="flight-button flight-button--primary">Explore the committees <ArrowDown aria-hidden="true" /></Link>
              <Link href={conference.instagramUrl} target="_blank" rel="noreferrer" className="flight-button flight-button--ghost">{conference.instagramHandle} <ArrowUpRight aria-hidden="true" /></Link>
            </div>
          </FadeIn></div>
          <FadeIn delay={180} className="hero-mark" direction="left">
            <div className="hero-mark__index" aria-hidden="true">27</div>
            <Image src="/munair_logo.jpg" alt="MUNAIR globe and wings emblem" width={1080} height={1080} className="hero-logo" priority />
            <div className="hero-route"><div><span>From</span><strong>İZM</strong></div><Plane aria-hidden="true" /><div><span>To</span><strong>WORLD</strong></div></div>
          </FadeIn>
        </div>
        <div className="hero-strip"><div className="site-container hero-strip__inner">
          <span><CalendarDays aria-hidden="true" /> {conference.dates}</span>
          <span><MapPin aria-hidden="true" /> {place}</span>
          <span><RadioTower aria-hidden="true" /> {conference.hashtag}</span>
        </div></div>
      </section>

      {settings.sections.about && <section id="about" className="section-shell bg-[var(--paper)]"><div className="site-container">
        <SectionHeading code="MNA / 01" label="The conference">Where aviation meets diplomacy.</SectionHeading>
        <div className="about-layout">
          <FadeIn className="about-statement"><p>MUNAIR is a student-led Model United Nations conference founded at Havajet Aviation High School in 2025.</p></FadeIn>
          <FadeIn delay={120} className="about-copy">
            <p>Our third official session brings delegates into rooms built for serious research, clear argument, and cooperation across different points of view.</p>
            <p>The aviation setting is more than a theme. It stands for discipline, international connection, and the confidence to move beyond familiar borders.</p>
            <dl className="about-facts"><div><dt>Session</dt><dd>03</dd></div><div><dt>Founded</dt><dd>2025</dd></div><div><dt>Language</dt><dd>English</dd></div></dl>
          </FadeIn>
        </div>
      </div></section>}

      {settings.sections.committees && <section id="committees" className="section-shell committee-section"><div className="site-container">
        <SectionHeading code="MNA / 02" label="Committee roster" inverse>Six rooms. Six different ways to see the world.</SectionHeading>
        <div className="committee-board">
          <div className="committee-board__head"><span>Gate</span><span>Committee</span><span>Brief</span><span>Status</span></div>
          {committees.map((committee, index) => <FadeIn key={committee.id} delay={index * 55}><Link href={`/committees/${committee.slug}`} className="committee-row">
            <span className="committee-code">{String(index + 1).padStart(2, "0")}</span><strong>{committee.name}</strong><span className="committee-brief">{committee.description}</span><span className="committee-status">Preview <ArrowUpRight aria-hidden="true" /></span>
          </Link></FadeIn>)}
        </div>
        <p className="placeholder-note">Committee names and briefs are working placeholders for layout review.</p>
      </div></section>}

      {settings.sections.letters && <section id="letters" className="section-shell letter-section"><div className="site-container">
        <SectionHeading code="MNA / 03" label="Letters">A note from the flight deck.</SectionHeading>
        {settings.letters.map((letter) => <article key={letter.id} className="letter-layout">
          <FadeIn className="letter-title-block"><span className="letter-quote" aria-hidden="true">“</span><h3>{letter.titlePrefix}<br /><em>{letter.titleHighlight}</em></h3></FadeIn>
          <FadeIn delay={120} className="letter-body"><p className="letter-opening">{letter.opening},</p>{letter.paragraphs.map((paragraph) => <p key={paragraph}>{formatConferenceText(paragraph, settings)}</p>)}<p className="letter-signature">{letter.author}</p><p className="placeholder-note">Placeholder name — replace from the admin panel.</p></FadeIn>
        </article>)}
      </div></section>}

      {settings.sections.team && <section id="team" className="section-shell team-section"><div className="site-container">
        <SectionHeading code="MNA / 04" label="Secretariat">The people clearing the runway.</SectionHeading>
        <div className="team-roster">{team.map((member, index) => <FadeIn key={member.id} delay={index * 70}><Link href={`/team/${member.slug}`} className="team-seat">
          <span className="team-seat__number">Seat {String(index + 1).padStart(2, "0")}</span><div className="team-seat__portrait">{member.imageUrl ? <Image src={member.imageUrl} alt="" fill unoptimized sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" /> : <span>{member.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span>}</div><h3>{member.name}</h3><p>{member.role}</p>
        </Link></FadeIn>)}</div>
        <p className="placeholder-note">Names and portraits are placeholders until the MUNAIR’27 secretariat is added.</p>
      </div></section>}

      {settings.sections.applications && <section id="applications" className="section-shell application-section"><div className="site-container application-layout">
        <div><p className="route-label">MNA / 05 — Applications</p><h2>Find your role<br />on board.</h2><p className="application-intro">The application system is ready. Each route will open when the MUNAIR’27 calendar is finalized.</p></div>
        <div className="application-list">{settings.applications.map((application, index) => {
          const content = <><span>{String(index + 1).padStart(2, "0")}</span><strong>{application.title}</strong><small>{application.description}</small><b>{application.enabled ? "Apply" : "Preview"}<ArrowRight aria-hidden="true" /></b></>;
          return application.enabled ? <Link key={application.id} href={`/apply/${application.id}`} className="application-route">{content}</Link> : <div key={application.id} className="application-route application-route--disabled">{content}</div>;
        })}</div>
      </div></section>}

      <section id="venue" className="venue-section"><div className="site-container venue-layout">
        <div><p className="route-label">MNA / 06 — Destination</p><h2>Havajet Aviation<br />High School</h2></div>
        <div className="venue-details"><p>Havajet Havacılık Lisesi<br />İzmir, Türkiye 35672</p><Link href={MAPS_URL} target="_blank" rel="noreferrer" className="map-link">Open location in Maps <ArrowUpRight aria-hidden="true" /></Link></div>
      </div></section>
    </>
  );
}
