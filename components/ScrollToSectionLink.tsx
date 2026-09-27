"use client";

import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { scrollToSection } from "@/lib/scroll-to-section";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { sectionId: string };

export default function ScrollToSectionLink({ sectionId, onClick, ...props }: Props) {
  const pathname = usePathname();
  const lenis = useLenis();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || pathname !== "/") return;
    event.preventDefault();
    scrollToSection(sectionId, lenis);
  };

  return <a {...props} href={`/#${sectionId}`} onClick={handleClick} />;
}
