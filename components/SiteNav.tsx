"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Compass, FilePenLine, Landmark, MailOpen, MapPin, Menu, MessageCircle, UsersRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { DialogContent, DialogRoot, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const links: ReadonlyArray<{ id: string; label: string; icon: LucideIcon }> = [
  { id: "about", label: "About", icon: Compass },
  { id: "letters", label: "Letters", icon: MailOpen },
  { id: "committees", label: "Committees", icon: Landmark },
  { id: "team", label: "Team", icon: UsersRound },
  { id: "applications", label: "Apply", icon: FilePenLine },
  { id: "venue", label: "Venue", icon: MapPin },
  { id: "contact", label: "Contact", icon: MessageCircle },
];

export default function SiteNav({ enabled }: { enabled: Record<string, boolean> }) {
  const [active, setActive] = useState("about");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    const sections = links.flatMap(({ id }) => { const element = document.getElementById(id); return element ? [element] : []; });
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: "-28% 0px -62%", threshold: [0, .2, .7] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (id: string, event: MouseEvent<HTMLAnchorElement>) => {
    setOpen(false);
    if (pathname !== "/") return;
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    const offset = -(document.querySelector("header")?.getBoundingClientRect().height ?? 80);
    if (lenis) lenis.scrollTo(target, { offset }); else target.scrollIntoView({ behavior: "smooth" });
    window.history.replaceState(null, "", id === "top" ? "/" : `/#${id}`);
  };

  const visible = links.filter(({ id }) => id === "venue" || enabled[id] !== false);
  return <header className="site-header sticky top-0 z-50 text-white">
    <div className="site-container flex h-[var(--nav-height)] items-center justify-between gap-4">
      <Link href="/#top" onClick={(event) => handleNavClick("top", event)} className="nav-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--blue-light)]" aria-label="MUNAIR home">
        <Image src="/munair_logo.jpg" alt="" width={48} height={48} className="size-9 object-cover" priority /><span>MUNAIR<small>2027</small></span>
      </Link>
      <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">{visible.map(({ id, label }) => <Link key={id} href={`/#${id}`} onClick={(event) => handleNavClick(id, event)} className={cn("text-[11px] font-extrabold uppercase tracking-[.15em] transition-colors hover:text-[var(--blue-light)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--blue)]", active === id ? "text-[var(--blue-light)]" : "text-white/68")} aria-current={active === id ? "location" : undefined}>{label}</Link>)}</nav>
      <DialogRoot open={open} onOpenChange={setOpen}>
        <DialogTrigger className="grid size-11 place-items-center border border-white/25 bg-white/5 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue)] lg:hidden" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-navigation-drawer"><Menu aria-hidden="true" size={21} /></DialogTrigger>
        <DialogContent id="mobile-navigation-drawer" title="Navigation" description="Move through MUNAIR’27." variant="drawer">
          <div className="mb-6 border-y border-white/10 py-4"><p className="eyebrow text-[var(--blue-light)]">MUNAIR’27</p><p className="mt-2 text-sm leading-6 text-white/55">Wings of diplomacy</p></div>
          <nav className="flex flex-col" aria-label="Mobile navigation">{visible.map(({ id, label, icon: Icon }) => <Link key={id} href={`/#${id}`} onClick={(event) => handleNavClick(id, event)} className={cn("group flex min-h-14 items-center gap-3 border-t border-white/12 py-4 text-xl font-semibold transition-colors last:border-b focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--blue)]", active === id ? "text-[var(--blue-light)]" : "text-white hover:text-[var(--blue-light)]")} aria-current={active === id ? "location" : undefined}><Icon aria-hidden="true" className="size-5 shrink-0" strokeWidth={1.8} /><span>{label}</span><ArrowUpRight aria-hidden="true" className="ml-auto size-4 opacity-45" /></Link>)}</nav>
          <div className="mt-7 border-t border-white/10 pt-5"><p className="eyebrow text-white/40">MUNAIR’27</p><p className="mt-2 max-w-[16rem] text-sm leading-6 text-white/55">Debate with purpose. Negotiate beyond borders.</p></div>
        </DialogContent>
      </DialogRoot>
    </div>
  </header>;
}
