import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { notFound } from "next/navigation";
import { getCommitteeBySlug } from "@/lib/site-settings";
import { getPublicContent } from "@/lib/site-settings";
import { pageMetadata } from "@/lib/seo";

import FadeIn from "@/components/FadeIn";

export const instant = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [{ settings }, item] = await Promise.all([getPublicContent(), getCommitteeBySlug(slug)]);
  if (!item) return { title: "Committee", robots: { index: false, follow: false } };

  return pageMetadata({
    settings,
    title: item.name,
    description: `${item.description} Explore study materials and committee information for ${settings.conference.displayName}.`,
    path: `/committees/${item.slug}`,
    imagePath: item.imageUrl || undefined,
    imageAlt: `${item.name} committee`,
  });
}

export default async function CommitteePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getCommitteeBySlug(slug);
  if (!item) notFound();
  return (
    <article className="bg-[var(--charcoal)] text-white">
      <div className="site-container py-14 sm:py-24">
        <FadeIn delay={50}>
          <Link href="/#committees" className="inline-flex items-center gap-2 text-sm font-bold text-white/65 hover:text-[var(--red)]">
            <ArrowLeft className="size-4" /> Committees
          </Link>
        </FadeIn>
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_24rem]">
          <FadeIn delay={120}>
            <div>
              <p className="eyebrow text-[var(--blue)]">MUNAIR’27 committee</p>
              <h1 className="mt-5 font-display text-6xl leading-[.98] tracking-[-.02em] sm:text-8xl">{item.name}</h1>
              <p className="mt-10 max-w-3xl whitespace-pre-line text-lg leading-8 text-white/72">{item.description}</p>
              {item.documents.length > 0 && (
                <div className="mt-12 border-t border-white/15 pt-7">
                  <p className="eyebrow text-white/45">Documents</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {item.documents.map((document) => (
                      <a key={document.url} className="inline-flex items-center gap-2 border border-white/25 px-4 py-3 text-sm font-bold hover:border-[var(--red)]" href={document.url} target="_blank" rel="noreferrer">
                        <Download className="size-4" />{document.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </FadeIn>
          <FadeIn delay={220} className="relative aspect-square bg-[var(--brown)]">
            {item.imageUrl ? (
              <Image src={item.imageUrl} alt={`${item.name} committee`} fill unoptimized className="object-cover" sizes="400px" />
            ) : (
              <div className="grid size-full place-items-center font-display text-8xl text-white/50">{item.name.charAt(0)}</div>
            )}
          </FadeIn>
        </div>
      </div>
    </article>
  );
}
