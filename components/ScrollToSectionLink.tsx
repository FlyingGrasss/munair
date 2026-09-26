"use client";

import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import type { AnchorHTMLAttributes, MouseEvent } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { sectionId: string };

export default function ScrollToSectionLink({ sectionId, onClick, ...props }: Props) {
  const pathname = usePathname();
  const lenis = useLenis();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || pathname !== "/") return;

    const target = document.getElementById(sectionId);
    if (!target) return;
    event.preventDefault();

    const offset = -(document.querySelector("header")?.getBoundingClientRect().height ?? 80);
    if (lenis) lenis.scrollTo(target, { offset });
    else target.scrollIntoView({ behavior: "smooth" });
    window.history.replaceState(null, "", `/#${sectionId}`);
  };

  return <a {...props} href={`/#${sectionId}`} onClick={handleClick} />;
}
