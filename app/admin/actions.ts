"use server";

import { assertOrigin, clearAdminSession, createAdminSession, verifyAdminPassword, requireAdminMutation, revokeAllAdminSessions } from "@/lib/admin-auth";
import { parseDocuments } from "@/lib/documents";
import { prisma } from "@/lib/prisma";
import { toSlug } from "@/lib/slug";
import { getPublicContent, normalizeSettings } from "@/lib/site-settings";
import { normalizeQuestionDefinition, type QuestionDefinition, type QuestionType } from "@/lib/questions";
import { revalidatePath, updateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ApplicationType, SiteSettings } from "@/types/conference";
import { allowRequest } from "@/lib/applications/security";

function stringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function intValue(formData: FormData, key: string) {
  const parsed = Number(stringValue(formData, key));
  return Number.isFinite(parsed) ? parsed : 0;
}

function checkboxValue(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

export async function loginAction(formData: FormData) {
  await assertOrigin();
  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip") || "unknown";
  if (!(await allowRequest(`${ip}:admin-login`))) redirect("/admin/login?error=rate");
  const password = stringValue(formData, "password");

  if (!(await verifyAdminPassword(password))) {
    redirect("/admin/login?error=1");
  }

  await createAdminSession();
  redirect("/admin");
}

export async function logoutAction() {
  await requireAdminMutation();
  await clearAdminSession();
  redirect("/admin/login");
}

export async function revokeAllSessionsAction() {
  await requireAdminMutation();
  await revokeAllAdminSessions();
  redirect("/admin/login");
}

export async function createCommitteeAction(formData: FormData) {
  await requireAdminMutation();
  const name = stringValue(formData, "name");
  if (!name) return;
  const slug = stringValue(formData, "slug") || toSlug(name);

  await prisma.committee.create({
    data: {
      name,
      slug,
      sortOrder: intValue(formData, "sortOrder"),
      imageUrl: stringValue(formData, "imageUrl") || null,
      description: stringValue(formData, "description"),
      documents: parseDocuments(formData.get("documents")),
      isPublished: checkboxValue(formData, "isPublished"),
    },
  });

  updateTag("site-content");
  revalidatePath("/committees");
  revalidatePath("/");
  redirect("/admin");
}

export async function updateCommitteeAction(id: number, formData: FormData) {
  await requireAdminMutation();
  const name = stringValue(formData, "name");
  if (!id || !name) return;
  const slug = stringValue(formData, "slug") || toSlug(name);
  const imageUrl = stringValue(formData, "imageUrl") || null;

  await prisma.committee.update({
    where: { id },
    data: {
      name,
      slug,
      sortOrder: intValue(formData, "sortOrder"),
      imageUrl,
      description: stringValue(formData, "description"),
      documents: parseDocuments(formData.get("documents")),
      isPublished: checkboxValue(formData, "isPublished"),
    },
  });

  updateTag("site-content");
  revalidatePath("/committees");
  revalidatePath("/");
  redirect("/admin");
}

export async function deleteCommitteeAction(id: number) {
  await requireAdminMutation();
  await prisma.committee.delete({ where: { id } });
  updateTag("site-content");
  revalidatePath("/committees");
  revalidatePath("/");
  redirect("/admin");
}

export async function createTeamMemberAction(formData: FormData) {
  await requireAdminMutation();
  const name = stringValue(formData, "name");
  if (!name) return;
  const slug = stringValue(formData, "slug") || toSlug(name);

  await prisma.teamMember.create({
    data: {
      name,
      slug,
      role: stringValue(formData, "role"),
      sortOrder: intValue(formData, "sortOrder"),
      imageUrl: stringValue(formData, "imageUrl") || null,
      bio: stringValue(formData, "bio"),
      instagram: stringValue(formData, "instagram") || null,
      isPublished: checkboxValue(formData, "isPublished"),
    },
  });

  updateTag("site-content");
  revalidatePath("/team");
  revalidatePath("/");
  redirect("/admin");
}

export async function updateTeamMemberAction(id: number, formData: FormData) {
  await requireAdminMutation();
  const name = stringValue(formData, "name");
  if (!id || !name) return;
  const slug = stringValue(formData, "slug") || toSlug(name);
  const imageUrl = stringValue(formData, "imageUrl") || null;

  await prisma.teamMember.update({
    where: { id },
    data: {
      name,
      slug,
      role: stringValue(formData, "role"),
      sortOrder: intValue(formData, "sortOrder"),
      imageUrl,
      bio: stringValue(formData, "bio"),
      instagram: stringValue(formData, "instagram") || null,
      isPublished: checkboxValue(formData, "isPublished"),
    },
  });

  updateTag("site-content");
  revalidatePath("/team");
  revalidatePath("/");
  redirect("/admin");
}

export async function deleteTeamMemberAction(id: number) {
  await requireAdminMutation();
  await prisma.teamMember.delete({ where: { id } });
  updateTag("site-content");
  revalidatePath("/team");
  revalidatePath("/");
  redirect("/admin");
}

export async function saveConferenceSettingsAction(formData: FormData) {
  await requireAdminMutation();

  const current = await getPublicContent();
  const settings = JSON.parse(JSON.stringify(current.settings)) as SiteSettings;
  const conference = settings.conference;

  conference.brandName = stringValue(formData, "brandName") || conference.brandName;
  conference.shortName = stringValue(formData, "shortName") || conference.shortName;
  conference.displayName = stringValue(formData, "displayName") || conference.displayName;
  conference.fullName = stringValue(formData, "fullName") || conference.fullName;
  conference.sessionName = stringValue(formData, "sessionName") || conference.sessionName;
  conference.dates = stringValue(formData, "dates") || conference.dates;
  conference.startDateIso = stringValue(formData, "startDateIso") || conference.startDateIso;
  conference.year = intValue(formData, "year") || conference.year;
  conference.hashtag = stringValue(formData, "hashtag") || conference.hashtag;
  conference.siteUrl = stringValue(formData, "siteUrl") || conference.siteUrl;
  conference.senderEmail = stringValue(formData, "senderEmail").trim() || conference.senderEmail;
  conference.contactEmail = stringValue(formData, "contactEmail").trim() || conference.contactEmail;
  conference.instagramUrl = stringValue(formData, "instagramUrl").trim() || conference.instagramUrl;
  conference.instagramHandle = stringValue(formData, "instagramHandle").trim() || conference.instagramHandle;

  if (conference.location) {
    conference.location.venue = stringValue(formData, "venue") || conference.location.venue;
    conference.location.city = stringValue(formData, "locationCity") || conference.location.city;
    conference.location.country = stringValue(formData, "locationCountry") || conference.location.country;
  }

  if (conference.organizer) {
    conference.organizer.name = stringValue(formData, "organizerName") || conference.organizer.name;
  }

  settings.form.minimumDelegates = Math.max(1, intValue(formData, "minimumDelegates") || settings.form.minimumDelegates);

  settings.sections.about = checkboxValue(formData, "sectionAbout");
  settings.sections.committees = checkboxValue(formData, "sectionCommittees");
  settings.sections.team = checkboxValue(formData, "sectionTeam");
  settings.sections.letters = checkboxValue(formData, "sectionLetters");
  settings.sections.applications = checkboxValue(formData, "sectionApplications");
  settings.sections.contact = checkboxValue(formData, "sectionContact");

  for (const application of settings.applications) {
    application.enabled = checkboxValue(formData, `application_${application.id}_enabled`);
    application.title = stringValue(formData, `application_${application.id}_title`) || application.title;
    application.formTitle = stringValue(formData, `application_${application.id}_formTitle`) || application.formTitle;
    application.description = stringValue(formData, `application_${application.id}_description`) || application.description;
  }

  const questionTypes = Object.keys(settings.form.questions);
  for (const type of questionTypes) {
    const questions: QuestionDefinition[] = [];
    const count = intValue(formData, `question_${type}_count`);
    for (let index = 0; index < count; index += 1) {
      const id = stringValue(formData, `question_${type}_${index}_id`).replace(/[^a-zA-Z0-9_]/g, "");
      const label = stringValue(formData, `question_${type}_${index}_label`);
      if (!id || !label) continue;
      questions.push(
        normalizeQuestionDefinition(
          {
            id,
            label,
            type: stringValue(formData, `question_${type}_${index}_type`) as QuestionType,
            required: checkboxValue(formData, `question_${type}_${index}_required`),
            placeholder: stringValue(formData, `question_${type}_${index}_placeholder`),
            options: stringValue(formData, `question_${type}_${index}_options`)
              .split(/\r?\n/)
              .map((opt) => opt.trim())
              .filter(Boolean),
            minWords: Math.max(0, intValue(formData, `question_${type}_${index}_minWords`)),
            minCharacters: Math.max(0, intValue(formData, `question_${type}_${index}_minCharacters`)),
          },
          id,
          settings.form
        )
      );
    }
    settings.form.questions[type as ApplicationType] = questions;
  }

  const letterCount = Math.max(0, intValue(formData, "lettersCount"));
  settings.letters = Array.from({ length: letterCount }, (_, index) => {
    const prefix = `letter_${index}`;
    const paragraphs = stringValue(formData, `${prefix}_paragraphs`)
      .split(/\r?\n\s*\r?\n/)
      .map((p) => p.trim())
      .filter(Boolean);
    return {
      id: stringValue(formData, `${prefix}_id`).replace(/[^a-zA-Z0-9_-]/g, "") || `letter-${index + 1}`,
      titlePrefix: stringValue(formData, `${prefix}_titlePrefix`),
      titleHighlight: stringValue(formData, `${prefix}_titleHighlight`),
      opening: stringValue(formData, `${prefix}_opening`),
      paragraphs,
      author: stringValue(formData, `${prefix}_author`),
    };
  });

  const normalized = normalizeSettings(settings);

  await prisma.conferenceSettings.upsert({
    where: { id: 1 },
    create: { id: 1, data: normalized },
    update: { data: normalized },
  });

  updateTag("site-content");
  revalidatePath("/", "layout");
  revalidatePath("/apply");
  revalidatePath("/committees");
  revalidatePath("/team");
  for (const application of settings.applications) {
    revalidatePath(`/apply/${application.id}`);
  }

  return { ok: true };
}
