import type { Metadata } from "next";
import Link from "next/link";

import { DESIGN_LIST, INSTAGRAM_SIZE } from "@/design/instagram/data";

export const metadata: Metadata = {
  title: "Instagram design studio",
  robots: { index: false, follow: false },
};

export default function InstagramDesignStudioPage() {
  return (
    <div className="site-container py-16 lg:py-24">
      <div className="max-w-3xl">
        <p className="eyebrow text-[var(--blue)]">Internal design tool</p>
        <h1 className="mt-3 font-display text-5xl leading-[.96] tracking-[-.03em] lg:text-7xl">
          Instagram design studio.
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--muted)]">
          Three-slide committee carousels rendered from code at {INSTAGRAM_SIZE.width}×{INSTAGRAM_SIZE.height}.
          Edit the copy in <code className="rounded bg-[var(--ice)] px-1.5 py-0.5">design/instagram/data.ts</code>{" "}
          and refresh this page.
        </p>
      </div>

      <div className="mt-14 space-y-20">
        {DESIGN_LIST.map((design) => (
          <section key={design.slug} aria-labelledby={`${design.slug}-title`}>
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border)] pb-5">
              <div>
                <p className="eyebrow text-[var(--blue)]">
                  {design.order} · {design.abbr}
                </p>
                <h2 id={`${design.slug}-title`} className="mt-1 font-display text-4xl tracking-[-.02em]">
                  {design.name}
                </h2>
              </div>
              <p className="text-xs font-bold uppercase tracking-[.14em] text-[var(--muted)]">
                /api/design/instagram/{design.slug}/1
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((slide) => (
                <figure key={slide} className="min-w-0">
                  <a
                    href={`/api/design/instagram/${design.slug}/${slide}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block overflow-hidden border border-[var(--border)] bg-[var(--ice)]"
                  >
                    <img
                      src={`/api/design/instagram/${design.slug}/${slide}`}
                      alt={`${design.name} slide ${slide}`}
                      width={INSTAGRAM_SIZE.width}
                      height={INSTAGRAM_SIZE.height}
                      loading="lazy"
                      className="h-auto w-full"
                    />
                  </a>
                  <figcaption className="mt-2 flex items-center justify-between gap-3 text-xs">
                    <span className="font-bold uppercase tracking-[.14em] text-[var(--muted)]">Slide 0{slide}</span>
                    <Link
                      href={`/api/design/instagram/${design.slug}/${slide}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-[var(--blue)] underline underline-offset-4"
                    >
                      Open PNG
                    </Link>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
