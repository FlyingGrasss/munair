import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, DM_Sans, DM_Serif_Display, Instrument_Serif, Manrope, Space_Grotesk } from "next/font/google";
import Footer from "@/components/Footer";
import FontVariant from "@/components/FontVariant";
import SiteNav from "@/components/SiteNav";
import SmoothScroll from "@/components/SmoothScroll";
import { getPublicContent, publicSiteUrl } from "@/lib/site-settings";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  display: "swap",
});

const space = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getPublicContent();
  const siteUrl = publicSiteUrl(settings);
  const conference = settings.conference;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: conference.displayName,
      template: `%s | ${conference.displayName}`,
    },
    description: `${conference.sessionName}. Join us on ${conference.dates}. ${conference.hashtag}`,
    keywords: [conference.shortName, conference.brandName, "MUN", "Model United Nations", "MUNAIR 2027", "Izmir MUN", "aviation high school"],
    alternates: { canonical: "/" },
    authors: [{ name: conference.organizer.name || conference.brandName }],
    creator: conference.organizer.name || conference.brandName,
    publisher: conference.organizer.name || conference.brandName,
    icons: {
      icon: [{ url: "/icon.png", type: "image/png" }],
      apple: [{ url: "/icon.png", type: "image/png" }],
    },
    openGraph: {
      title: `${conference.displayName} | ${conference.fullName}`,
      description: `${conference.dates} | ${conference.sessionName}.`,
      url: siteUrl,
      siteName: conference.displayName,
      images: [{ url: `${siteUrl}/icon.png`, width: 640, height: 640, alt: `${conference.displayName} - ${conference.fullName}` }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${conference.displayName} | ${conference.fullName}`,
      description: `${conference.dates} | ${conference.hashtag}`,
      images: [`${siteUrl}/icon.png`],
    },
    robots: { index: true, follow: true, nocache: false, googleBot: { index: true, follow: true, noimageindex: false } },
  };
}

export const viewport: Viewport = { themeColor: "#121D2F", colorScheme: "light dark" };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { settings } = await getPublicContent();
  return (
    <html lang="en" className={`${manrope.variable} ${instrument.variable} ${dmSans.variable} ${dmSerif.variable} ${bodoni.variable} ${space.variable} scroll-smooth antialiased`}>
      <body className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
        <SmoothScroll>
          <FontVariant />
          <a className="skip-link" href="#main-content">Skip to content</a>
          <SiteNav enabled={settings.sections} />
          <main id="main-content">{children}</main>
          {settings.sections.contact && <Footer settings={settings} />}
        </SmoothScroll>
      </body>
    </html>
  );
}
