import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import StructuredData from "@/components/StructuredData";
import { formatConferenceText } from "@/config/conference";
import { getPublicContent } from "@/lib/site-settings";

const MAPS_URL = "https://maps.app.goo.gl/ZDZUrWwZVSbF21ki8";

function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return <p className="section-label"><span>{index}</span>{children}</p>;
}

export default async function Home() {
  const { settings, committees, team } = await getPublicContent();
  const { conference } = settings;

  return <>
    <StructuredData settings={settings} />

    <section id="top" className="home-hero">
      <div className="home-hero__wash" aria-hidden="true" />
      <div className="site-container home-hero__inner">
        <div className="home-hero__eyebrow"><span>Model United Nations of Aviation</span><span>3rd official session</span><span>İzmir, Türkiye</span></div>
        <div className="home-hero__content">
          <FadeIn className="home-hero__copy" delay={80} direction="none">
            <p className="home-hero__overline">{conference.hashtag}</p>
            <h1>MUNAIR<sup>’27</sup></h1>
            <p className="home-hero__intro">A student-led conference for people who want to understand the world, challenge assumptions, and make the room move.</p>
            <div className="home-hero__actions">
              <Link href="/apply/delegate" className="hero-cta">Apply as a delegate <ArrowUpRight aria-hidden="true" /></Link>
              <Link href="#committees" className="hero-link">See the committees</Link>
            </div>
          </FadeIn>
          <FadeIn className="home-hero__image" delay={180} direction="left">
            <Image src="/munair_logo.jpg" alt="MUNAIR globe and wings emblem" width={1080} height={1080} priority />
            <span>Wings of diplomacy</span>
          </FadeIn>
        </div>
        <div className="home-hero__footer"><span>Havajet Aviation High School</span><span>{conference.dates}</span><span>Follow {conference.instagramHandle}</span></div>
      </div>
    </section>

    {settings.sections.about && <section id="about" className="home-introduction"><div className="site-container">
      <div className="introduction-top"><SectionLabel index="01">MUNAIR</SectionLabel><p>Model United Nations<br />of Aviation</p></div>
      <div className="introduction-grid"><FadeIn className="introduction-image" direction="none"><Image src="/applications/delegation.webp" alt="Students gathering at a Model United Nations conference" fill sizes="(max-width: 767px) 100vw, 55vw" /></FadeIn><FadeIn className="introduction-copy" delay={100}><h2>A room for<br /><em>better questions.</em></h2><p>MUNAIR’27 is built around research, respectful disagreement, and the confidence to speak when the answer is not obvious.</p><Link href="#letters">Read the welcome letter <ArrowUpRight aria-hidden="true" /></Link></FadeIn></div>
    </div></section>}

    {settings.sections.committees && <section id="committees" className="home-committees"><div className="site-container">
      <div className="committees-top"><SectionLabel index="02">Committees</SectionLabel><h2>Choose a question<br />worth arguing for.</h2></div>
      <div className="committee-list">{committees.map((committee, index) => <FadeIn key={committee.id} delay={index * 45}><Link href={`/committees/${committee.slug}`} className="committee-item"><span>{String(index + 1).padStart(2, "0")}</span><h3>{committee.name}</h3><p>{committee.description}</p><ArrowUpRight aria-hidden="true" /></Link></FadeIn>)}</div>
    </div></section>}

    {settings.sections.letters && <section id="letters" className="home-letter"><div className="site-container letter-grid">
      <div className="letter-image"><Image src="/applications/chair.jpg" alt="Students chairing a Model United Nations session" fill sizes="(max-width: 767px) 100vw, 42vw" /></div>
      {settings.letters.map((letter) => <FadeIn key={letter.id} className="letter-copy" delay={100}><SectionLabel index="03">Welcome</SectionLabel><h2>{letter.titlePrefix}<br /><em>{letter.titleHighlight}</em></h2><p className="letter-opening">{letter.opening},</p>{letter.paragraphs.map((paragraph) => <p key={paragraph}>{formatConferenceText(paragraph, settings)}</p>)}<div className="letter-author">{letter.author}</div></FadeIn>)}
    </div></section>}

    {settings.sections.team && <section id="team" className="home-team"><div className="site-container">
      <div className="team-top"><SectionLabel index="04">Secretariat</SectionLabel><h2>The people<br />behind the room.</h2></div>
      <div className="team-grid">{team.map((member, index) => <FadeIn key={member.id} delay={index * 60}><Link href={`/team/${member.slug}`} className="team-card"><div className="team-card__image"><Image src={member.imageUrl || "/applications/delegate.webp"} alt="" fill unoptimized sizes="(max-width: 767px) 50vw, 25vw" className="object-cover" /></div><div className="team-card__meta"><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{member.name}</h3><p>{member.role}</p></div><ArrowUpRight aria-hidden="true" /></div></Link></FadeIn>)}</div>
    </div></section>}

    {settings.sections.applications && <section id="applications" className="home-applications"><div className="site-container">
      <div className="applications-top"><SectionLabel index="05">Applications</SectionLabel><h2>There is a place<br />for you here.</h2><p>Choose the role that fits the way you want to contribute. All applications are open.</p></div>
      <div className="application-grid">{settings.applications.map((application, index) => <Link key={application.id} href={`/apply/${application.id}`} className="application-card"><div className="application-card__image"><Image src={application.imageUrl || "/applications/delegate.webp"} alt="" fill sizes="(max-width: 767px) 100vw, 33vw" className="object-cover" /></div><div className="application-card__copy"><span>{String(index + 1).padStart(2, "0")}</span><h3>{application.title}</h3><p>{application.description}</p><ArrowUpRight aria-hidden="true" /></div></Link>)}</div>
    </div></section>}

    <section id="venue" className="home-venue"><div className="site-container venue-grid"><div><SectionLabel index="06">Venue</SectionLabel><h2>See you<br />in İzmir.</h2></div><div className="venue-card"><MapPin aria-hidden="true" /><p>Havajet Havacılık Lisesi<br />İzmir, Türkiye 35672</p><Link href={MAPS_URL} target="_blank" rel="noreferrer">Open in Google Maps <ArrowUpRight aria-hidden="true" /></Link></div></div></section>
  </>;
}
