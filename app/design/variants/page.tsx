import type { Metadata } from "next";
import Link from "next/link";

import { INSTAGRAM_SIZE, STAY_TUNED_SLIDES, STAY_TUNED_VARIANTS } from "@/design/instagram/data";

export const metadata: Metadata = {
  title: "Stay tuned background variants",
  robots: { index: false, follow: false },
};

const VARIANTS = [
  { id: 1, name: "Satin folds", detail: "Kıvrımlı metalik dalga geçişleri" },
  { id: 2, name: "Striped satin", detail: "Çizgili ışık huzmeleri ve dalga gölgeleri" },
  { id: 3, name: "Smoky folds", detail: "Fotoğraf benzeri yumuşak lekeler ve kıvrımlar" },
  { id: 4, name: "Wind ripples", detail: "Rüzgâr çizgileri ve ince dalga halkaları" },
];

export default function InstagramVariantsPage() {
  return (
    <div className="site-container py-16 lg:py-24">
      <div className="max-w-3xl">
        <p className="eyebrow text-[var(--blue)]">Internal design tool</p>
        <h1 className="mt-3 font-display text-5xl leading-[.96] tracking-[-.03em] lg:text-7xl">
          Stay tuned backgrounds.
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--muted)]">
          Dört arka plan varyantı, aynı koyu lacivert paletle. Her biri üç panelli carousel olarak render edilir.
          Doğrudan PNG bağlantıları için görsellere tıkla.
        </p>
        <Link
          href="/design/instagram"
          className="mt-5 inline-block font-bold text-[var(--blue)] underline underline-offset-4"
        >
          Design studio&apos;ya dön
        </Link>
      </div>

      <div className="mt-14 space-y-20">
        {VARIANTS.slice(0, STAY_TUNED_VARIANTS).map((variant) => (
          <section key={variant.id}>
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border)] pb-5">
              <div>
                <p className="eyebrow text-[var(--blue)]">Variant 0{variant.id}</p>
                <h2 className="mt-1 font-display text-4xl tracking-[-.02em]">{variant.name}</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">{variant.detail}</p>
              </div>
              <p className="text-xs font-bold uppercase tracking-[.14em] text-[var(--muted)]">
                ?v={variant.id}
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {Array.from({ length: STAY_TUNED_SLIDES }, (_, index) => index + 1).map((slide) => {
                const src = `/api/design/instagram/stay-tuned/${slide}?v=${variant.id}`;
                return (
                  <figure key={slide} className="min-w-0">
                    <a
                      href={src}
                      target="_blank"
                      rel="noreferrer"
                      className="block overflow-hidden border border-[var(--border)] bg-[var(--ice)]"
                    >
                      <img
                        src={src}
                        alt={`Variant ${variant.id} slide ${slide}`}
                        width={INSTAGRAM_SIZE.width}
                        height={INSTAGRAM_SIZE.height}
                        loading="lazy"
                        className="h-auto w-full"
                      />
                    </a>
                    <figcaption className="mt-2 flex items-center justify-between gap-3 text-xs">
                      <span className="font-bold uppercase tracking-[.14em] text-[var(--muted)]">
                        Slide 0{slide}
                      </span>
                      <Link
                        href={src}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-[var(--blue)] underline underline-offset-4"
                      >
                        Open PNG
                      </Link>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
