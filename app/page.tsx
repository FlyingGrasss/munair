import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, MapPin } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import StructuredData from "@/components/StructuredData";
import { formatConferenceText } from "@/config/conference";
import { getPublicContent } from "@/lib/site-settings";

const MAPS_URL = "https://maps.app.goo.gl/ZDZUrWwZVSbF21ki8";

function Heading({ index, label, children }: { index: string; label: string; children: React.ReactNode }) {
  return <div className="m-heading"><p><span>{index}</span>{label}</p><h2>{children}</h2></div>;
}

export default async function Home() {
  const { settings, committees, team } = await getPublicContent();

  return <>
    <StructuredData settings={settings} />

    <section id="top" className="m-hero">
      <div className="m-hero__rail" aria-hidden="true"><span>MUNAIR / 27</span><span>WINGS OF DIPLOMACY</span></div>
      <div className="site-container m-hero__stage">
        <div className="m-hero__topline"><span>Third official session</span><span>Havajet Aviation High School</span><span>İzmir / Türkiye</span></div>
        <FadeIn className="m-hero__mark" delay={80} direction="none">
          <Image src="/munair_logo.jpg" alt="MUNAIR globe and wings emblem" width={1080} height={1080} priority />
        </FadeIn>
        <FadeIn className="m-hero__type" delay={160}>
          <h1><span>MUN</span><span>AIR</span></h1>
          <div><strong>’27</strong><p>Model United Nations<br />of Aviation</p></div>
        </FadeIn>
        <div className="m-hero__bottom">
          <p>A student-led conference for delegates ready to think clearly, speak boldly, and negotiate beyond borders.</p>
          <Link href="#about">Enter MUNAIR <ArrowDownRight aria-hidden="true" /></Link>
        </div>
      </div>
    </section>

    {settings.sections.about && <section id="about" className="m-about"><div className="site-container">
      <Heading index="01" label="About">Diplomacy,<br />with altitude.</Heading>
      <div className="m-about__body">
        <FadeIn className="m-about__lead"><p>Founded in 2025 at Havajet Aviation High School, MUNAIR brings the discipline of aviation into the practice of diplomacy.</p></FadeIn>
        <FadeIn className="m-about__detail" delay={100}><p>Delegates research global questions, represent perspectives beyond their own, and work toward solutions under pressure. The third official session continues that mission in İzmir.</p></FadeIn>
      </div>
      <div className="m-facts"><div><span>03</span><p>Official session</p></div><div><span>2025</span><p>Established</p></div><div><span>EN</span><p>Conference language</p></div><div><span>İZM</span><p>Home base</p></div></div>
    </div></section>}

    {settings.sections.committees && <section id="committees" className="m-committees"><div className="site-container">
      <Heading index="02" label="Committees">Global questions.<br />Different rooms.</Heading>
      <div className="m-committee-list">{committees.map((committee, index) => <FadeIn key={committee.id} delay={index * 45}>
        <Link href={`/committees/${committee.slug}`} className="m-committee">
          <span>{String(index + 1).padStart(2, "0")}</span><h3>{committee.name}</h3><p>{committee.description}</p><ArrowUpRight aria-hidden="true" />
        </Link>
      </FadeIn>)}</div>
    </div></section>}

    {settings.sections.letters && <section id="letters" className="m-letter"><div className="site-container m-letter__grid">
      <div><p className="m-label"><span>03</span> Letter</p><h2>Before we<br />take flight.</h2></div>
      {settings.letters.map((letter) => <FadeIn key={letter.id} className="m-letter__copy" delay={100}>
        <p className="m-letter__opening">{letter.opening},</p>
        {letter.paragraphs.map((paragraph) => <p key={paragraph}>{formatConferenceText(paragraph, settings)}</p>)}
        <div className="m-letter__sign"><span>{letter.author}</span><small>MUNAIR’27</small></div>
      </FadeIn>)}
    </div></section>}

    {settings.sections.team && <section id="team" className="m-team"><div className="site-container">
      <Heading index="04" label="Secretariat">Built by students.<br />Run with purpose.</Heading>
      <div className="m-team__list">{team.map((member, index) => <FadeIn key={member.id} delay={index * 60}>
        <Link href={`/team/${member.slug}`} className="m-person">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <div className="m-person__photo">{member.imageUrl ? <Image src={member.imageUrl} alt="" fill unoptimized sizes="160px" className="object-cover" /> : <b>{member.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</b>}</div>
          <div><h3>{member.name}</h3><p>{member.role}</p></div><ArrowUpRight aria-hidden="true" />
        </Link>
      </FadeIn>)}</div>
    </div></section>}

    {settings.sections.applications && <section id="applications" className="m-applications"><div className="site-container m-applications__grid">
      <div className="m-applications__intro"><p className="m-label"><span>05</span> Applications</p><h2>Your place<br />at MUNAIR.</h2><p>Five ways to help shape the conference, from debate and procedure to media and operations.</p></div>
      <div className="m-role-list">{settings.applications.map((application, index) => application.enabled ?
        <Link href={`/apply/${application.id}`} className="m-role" key={application.id}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{application.title}</h3><p>{application.description}</p></div><ArrowUpRight aria-hidden="true" /></Link> :
        <div className="m-role" key={application.id}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{application.title}</h3><p>{application.description}</p></div></div>
      )}</div>
    </div></section>}

    <section id="venue" className="m-venue"><div className="site-container m-venue__grid">
      <div><p className="m-label"><span>06</span> Venue</p><h2>Meet us<br />in İzmir.</h2></div>
      <div className="m-venue__address"><MapPin aria-hidden="true" /><p>Havajet Havacılık Lisesi<br />İzmir, Türkiye 35672</p><Link href={MAPS_URL} target="_blank" rel="noreferrer">Open in Google Maps <ArrowUpRight aria-hidden="true" /></Link></div>
    </div></section>
  </>;
}
