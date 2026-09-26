import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, CalendarDays, MapPin, RadioTower } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import StructuredData from "@/components/StructuredData";
import { buttonVariants } from "@/components/ui/button";
import { formatConferenceText } from "@/config/conference";
import { getPublicContent } from "@/lib/site-settings";
import { cn } from "@/lib/utils";

function SectionTitle({ number, kicker, children, light = false }: { number: string; kicker: string; children: React.ReactNode; light?: boolean }) {
  return <FadeIn><div className="grid gap-5 border-t border-current/20 pt-5 md:grid-cols-[10rem_1fr]">
    <p className={cn("eyebrow", light ? "text-white/50" : "text-[var(--blue-dark)]")}>{number} / {kicker}</p>
    <h2 className="max-w-4xl font-display text-5xl leading-[.94] tracking-[-.025em] sm:text-7xl lg:text-8xl">{children}</h2>
  </div></FadeIn>;
}

export default async function Home() {
  const { settings, committees, team } = await getPublicContent();
  const place = `${settings.conference.location.venue}, ${settings.conference.location.city}`;
  return <>
    <StructuredData settings={settings} />
    <section id="top" className="hero-field relative isolate min-h-[calc(100svh-var(--nav-height))] overflow-hidden text-white">
      <div aria-hidden="true" className="flight-lines absolute inset-0 -z-10 opacity-40" />
      <div className="site-container grid min-h-[calc(100svh-var(--nav-height))] items-center gap-12 py-12 lg:grid-cols-[1fr_27rem] lg:py-16">
        <FadeIn delay={80}>
          <p className="eyebrow text-[var(--blue-light)]">{settings.conference.fullName}</p>
          <h1 className="mt-7 font-display text-[clamp(4.5rem,17vw,11rem)] leading-[.72] tracking-[-.055em]">MUN<span className="text-[var(--blue)]">AIR</span><span className="mt-4 block text-[clamp(2.4rem,8vw,5.5rem)] text-white/88">’27</span></h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-white/68">The third official session of MUNAIR, founded at Havajet Aviation High School. Debate with purpose. Negotiate beyond borders.</p>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4 text-xs font-extrabold uppercase tracking-[.14em] text-white/72">
            <span className="flex items-center gap-2"><CalendarDays className="size-4 text-[var(--blue-light)]" />{settings.conference.dates}</span>
            <span className="flex items-center gap-2"><MapPin className="size-4 text-[var(--blue-light)]" />{place}</span>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="#about" className={buttonVariants({ variant: "primary", className: "min-h-12 px-7" })}>Discover MUNAIR <ArrowDown className="size-4" /></Link>
            <Link href={settings.conference.instagramUrl} target="_blank" rel="noreferrer" className={buttonVariants({ variant: "light", className: "min-h-12 px-7" })}>Follow {settings.conference.instagramHandle} <ArrowUpRight className="size-4" /></Link>
          </div>
        </FadeIn>
        <FadeIn delay={220} className="mx-auto w-full max-w-md">
          <div className="logo-frame relative aspect-square overflow-hidden border border-white/15 bg-[#030406]"><Image src="/munair_logo.jpg" alt="MUNAIR globe and wings emblem" fill sizes="(max-width: 1024px) 88vw, 432px" className="object-cover" priority /></div>
          <div className="mt-5 grid grid-cols-[auto_1fr] items-center gap-4 border-t border-white/15 pt-5"><RadioTower className="size-6 text-[var(--blue-light)]" aria-hidden="true" /><div><p className="eyebrow text-white/45">Callsign</p><p className="mt-1 font-bold">{settings.conference.hashtag}</p></div></div>
        </FadeIn>
      </div>
    </section>

    {settings.sections.about && <section id="about" className="section-shell bg-[var(--ice)]"><div className="site-container">
      <SectionTitle number="01" kicker="The conference">Diplomacy takes flight in Izmir.</SectionTitle>
      <div className="mt-16 grid gap-10 md:grid-cols-[1fr_1.65fr]"><FadeIn delay={100}><p className="eyebrow text-[var(--blue)]">{settings.conference.hashtag}</p></FadeIn><FadeIn delay={180} className="space-y-7 text-xl leading-relaxed text-[var(--ink)]/76 sm:text-2xl"><p>MUNAIR is a student-led Model United Nations conference established in 2025 at Havajet Aviation High School.</p><p>Its third official session will bring delegates together to research urgent questions, represent different perspectives, and build solutions through disciplined debate and cooperation.</p></FadeIn></div>
    </div></section>}

    {settings.sections.letters && <section id="letters" className="section-shell bg-[var(--mist)]"><div className="site-container">
      <SectionTitle number="02" kicker="Welcome aboard">A word before departure.</SectionTitle>
      <div className="mt-16 grid gap-10 lg:grid-cols-[.65fr_1.35fr]"><FadeIn><p className="eyebrow text-[var(--blue-dark)]">From the organization</p></FadeIn><div className="space-y-14">{settings.letters.map((letter, index) => <FadeIn key={letter.id} delay={index * 100} as="article" className="border-t-2 border-[var(--navy)] pt-7"><h3 className="font-display text-4xl leading-none sm:text-5xl">{letter.titlePrefix} <span className="text-[var(--blue)]">{letter.titleHighlight}</span></h3><p className="mt-8 font-bold">{letter.opening},</p><div className="mt-5 space-y-5 text-base leading-8 text-[var(--ink)]/72">{letter.paragraphs.map((paragraph) => <p key={paragraph}>{formatConferenceText(paragraph, settings)}</p>)}</div>{letter.author && <p className="mt-8 text-xs font-extrabold uppercase tracking-[.14em]">{letter.author}</p>}</FadeIn>)}</div></div>
    </div></section>}

    {settings.sections.committees && <section id="committees" className="section-shell bg-[var(--navy)] text-white"><div className="site-container">
      <SectionTitle number="03" kicker="Committees" light>Questions worth crossing borders for.</SectionTitle>
      {committees.length ? <div className="mt-16 grid gap-px bg-white/15 sm:grid-cols-2 lg:grid-cols-3">{committees.map((committee, index) => <FadeIn key={committee.id} delay={index * 80}><Link href={`/committees/${committee.slug}`} className="group block min-h-72 bg-[var(--navy)] p-7 transition-colors hover:bg-[var(--blue-dark)]"><p className="eyebrow text-white/42">Committee {String(index + 1).padStart(2, "0")}</p><h3 className="mt-16 font-display text-4xl">{committee.name}</h3><p className="mt-5 line-clamp-3 text-sm leading-6 text-white/62">{committee.description}</p><span className="mt-8 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.12em] text-[var(--blue-light)]">Discover <ArrowUpRight className="size-4" /></span></Link></FadeIn>)}</div> : <FadeIn delay={100} className="mt-16 grid gap-8 border-y border-white/15 py-14 md:grid-cols-[10rem_1fr]"><p className="eyebrow text-[var(--blue-light)]">Flight plan pending</p><div><p className="font-display text-4xl sm:text-5xl">Committee announcements are on approach.</p><p className="mt-5 max-w-2xl leading-7 text-white/58">The agenda and study guides will be published here as soon as they are cleared.</p></div></FadeIn>}
    </div></section>}

    {settings.sections.team && <section id="team" className="section-shell bg-[var(--ice)]"><div className="site-container">
      <SectionTitle number="04" kicker="Secretariat">The crew behind MUNAIR.</SectionTitle>
      {team.length ? <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{team.map((member, index) => <FadeIn key={member.id} delay={index * 80}><Link href={`/team/${member.slug}`} className="group block border-t border-[var(--ink)] pt-5"><div className="relative aspect-[4/5] overflow-hidden bg-[var(--mist)]">{member.imageUrl ? <Image src={member.imageUrl} alt="" fill unoptimized sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" /> : <div className="grid size-full place-items-center font-display text-7xl text-[var(--blue-dark)]">{member.name.charAt(0)}</div>}</div><h3 className="mt-5 font-display text-3xl">{member.name}</h3><p className="mt-1 text-xs font-extrabold uppercase tracking-[.13em] text-[var(--blue)]">{member.role}</p></Link></FadeIn>)}</div> : <FadeIn delay={100} className="mt-16 grid gap-8 border-y border-[var(--ink)]/20 py-14 md:grid-cols-[10rem_1fr]"><p className="eyebrow text-[var(--blue)]">Crew manifest</p><div><p className="font-display text-4xl sm:text-5xl">The MUNAIR’27 team will be introduced here.</p><p className="mt-5 max-w-2xl leading-7 text-[var(--ink)]/60">Secretariat and organization announcements are coming soon.</p></div></FadeIn>}
    </div></section>}

    {settings.sections.applications && <section id="applications" className="section-shell bg-[var(--blue-dark)] text-white"><div className="site-container">
      <SectionTitle number="05" kicker="Applications" light>Choose your place in the room.</SectionTitle>
      <div className="mt-16 divide-y divide-white/18 border-y border-white/18">{settings.applications.map((application, index) => {
        const row = <div className="group grid gap-5 py-8 md:grid-cols-[5rem_14rem_1fr_auto] md:items-center"><span className="eyebrow text-white/40">{String(index + 1).padStart(2, "0")}</span><h3 className="font-display text-4xl">{application.title}</h3><p className="max-w-xl text-sm leading-6 text-white/64">{application.description}</p><span className={cn("min-w-28 border px-4 py-3 text-center text-[10px] font-extrabold uppercase tracking-[.13em]", application.enabled ? "border-[var(--blue-light)] text-[var(--blue-light)]" : "border-white/25 text-white/48")}>{application.enabled ? "Apply now" : "Opening soon"}</span></div>;
        return <FadeIn key={application.id} delay={index * 70}>{application.enabled ? <Link href={`/apply/${application.id}`} className="block hover:bg-white/[.035]">{row}</Link> : row}</FadeIn>;
      })}</div>
    </div></section>}

    <section id="venue" className="section-shell bg-[var(--mist)]"><div className="site-container">
      <SectionTitle number="06" kicker="Venue">Built for aviation. Ready for diplomacy.</SectionTitle>
      <FadeIn delay={120} className="mt-16 grid gap-8 border-y border-[var(--ink)]/20 py-10 md:grid-cols-2 md:items-end"><div><p className="eyebrow text-[var(--blue-dark)]">Havajet Aviation High School</p><p className="mt-5 max-w-lg text-xl leading-8 text-[var(--ink)]/68">Izmir, Turkey 35672</p></div><Link href="https://www.google.com/maps/search/?api=1&query=Havajet+Aviation+High+School+Izmir" target="_blank" rel="noreferrer" className="link-underline justify-self-start font-bold text-[var(--blue-dark)] md:justify-self-end">Open in Maps <ArrowUpRight className="ml-1 inline size-4" /></Link></FadeIn>
    </div></section>
  </>;
}
