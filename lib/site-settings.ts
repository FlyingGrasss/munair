import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { DEFAULT_COMMITTEES, DEFAULT_SETTINGS, DEFAULT_TEAM } from "@/config/conference";
import { isSafeDocumentUrl } from "@/lib/documents";
import type { PublicCommittee, PublicTeamMember, SiteSettings } from "@/types/conference";

type PublicContent = {
  settings: SiteSettings;
  committees: PublicCommittee[];
  team: PublicTeamMember[];
};

function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

export function normalizeSettings(value: unknown): SiteSettings {
  const source = record(value);
  if (!source) return structuredClone(DEFAULT_SETTINGS);
  const conference = record(source.conference) ?? {};
  const location = record(conference.location) ?? {};
  const organizer = record(conference.organizer) ?? {};
  const sections = record(source.sections) ?? {};
  const form = record(source.form) ?? {};
  const hasLegacyPlaceholderDates =
    conference.dates === "2027" &&
    conference.startDateIso === "2027-01-01T09:00:00+03:00" &&
    !conference.endDateIso;
  const normalizedConference = {
    ...DEFAULT_SETTINGS.conference,
    ...conference,
    ...(hasLegacyPlaceholderDates
      ? {
          dates: DEFAULT_SETTINGS.conference.dates,
          startDateIso: DEFAULT_SETTINGS.conference.startDateIso,
          endDateIso: DEFAULT_SETTINGS.conference.endDateIso,
        }
      : {}),
    location: { ...DEFAULT_SETTINGS.conference.location, ...location },
    organizer: { ...DEFAULT_SETTINGS.conference.organizer, ...organizer },
  };

  return {
    conference: normalizedConference as SiteSettings["conference"],
    sections: { ...DEFAULT_SETTINGS.sections, ...sections } as SiteSettings["sections"],
    applicationsClosed: source.applicationsClosed === true,
    applications: Array.isArray(source.applications)
      ? source.applications.map((value) => {
          const entry = record(value) ?? {};
          const fallback = DEFAULT_SETTINGS.applications.find((application) => application.id === entry.id);
          const externalUrl = typeof entry.externalUrl === "string" && isSafeDocumentUrl(entry.externalUrl)
            ? entry.externalUrl.trim()
            : "";
          return {
            ...(fallback ?? {}),
            ...entry,
            externalLinkEnabled: entry.externalLinkEnabled === true,
            externalUrl,
          };
        }) as SiteSettings["applications"]
      : structuredClone(DEFAULT_SETTINGS.applications),
    form: {
      ...DEFAULT_SETTINGS.form,
      ...form,
      questions: record(form.questions)
        ? form.questions as SiteSettings["form"]["questions"]
        : structuredClone(DEFAULT_SETTINGS.form.questions),
    },
    letters: Array.isArray(source.letters)
      ? source.letters as SiteSettings["letters"]
      : structuredClone(DEFAULT_SETTINGS.letters),
  };
}

function parseDocuments(value: unknown): PublicCommittee["documents"] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const entry = record(item);
    const label = typeof entry?.label === "string" ? entry.label : typeof entry?.title === "string" ? entry.title : "";
    return label && typeof entry?.url === "string" && isSafeDocumentUrl(entry.url)
      ? [{ label, url: entry.url }]
      : [];
  });
}

async function loadPublicContent(): Promise<PublicContent> {
  if (!process.env.DATABASE_URL) {
    return { settings: structuredClone(DEFAULT_SETTINGS), committees: structuredClone(DEFAULT_COMMITTEES), team: structuredClone(DEFAULT_TEAM) };
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const [stored, committees, team] = await Promise.all([
      prisma.conferenceSettings.findUnique({ where: { id: 1 } }),
      prisma.committee.findMany({ where: { isPublished: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
      prisma.teamMember.findMany({ where: { isPublished: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
    ]);

    return {
      settings: normalizeSettings(stored?.data),
      committees: committees.length ? committees.map((item) => ({ ...item, documents: parseDocuments(item.documents), updatedAt: item.updatedAt.toISOString() })) : structuredClone(DEFAULT_COMMITTEES),
      team: team.length ? team.map((item) => ({ ...item, updatedAt: item.updatedAt.toISOString() })) : structuredClone(DEFAULT_TEAM),
    };
  } catch (error) {
    console.error("[content] Falling back to built-in conference content", error instanceof Error ? error.name : "unknown");
    return { settings: structuredClone(DEFAULT_SETTINGS), committees: structuredClone(DEFAULT_COMMITTEES), team: structuredClone(DEFAULT_TEAM) };
  }
}

export async function getPublicContent(): Promise<PublicContent> {
  "use cache";
  cacheLife("minutes");
  cacheTag("site-content");
  return loadPublicContent();
}

export async function getCommitteeBySlug(slug: string) {
  const { committees } = await getPublicContent();
  return committees.find((item) => item.slug === slug) ?? null;
}

export async function getTeamMemberBySlug(slug: string) {
  const { team } = await getPublicContent();
  return team.find((item) => item.slug === slug) ?? null;
}

export function publicSiteUrl(settings: SiteSettings) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim() || settings.conference.siteUrl;
  try {
    return new URL(configured).toString().replace(/\/$/, "");
  } catch {
    return "http://localhost:3000";
  }
}
