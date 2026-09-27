"use client";

import { ReactLenis } from "lenis/react";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ autoRaf: true, lerp: 0.07, stopInertiaOnNavigate: true }}>
      {children}
    </ReactLenis>
  );
}
