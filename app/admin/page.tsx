export const instant = false;
import Link from "next/link";
import { logoutAction, revokeAllSessionsAction, createCommitteeAction, createTeamMemberAction, saveConferenceSettingsAction } from "@/app/admin/actions";
import AdminSettingsForm from "@/components/admin/AdminSettingsForm";
import AdminApplicationInbox from "@/components/admin/AdminApplicationInbox";
import ImageUrlField from "@/components/admin/ImageUrlField";
import NameAndSlugFields from "@/components/admin/NameAndSlugFields";
import { DEFAULT_SETTINGS } from "@/config/conference";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { getPublicContent } from "@/lib/site-settings";

export const metadata = {
  title: `Admin Dashboard | MUNAIR`,
  robots: "noindex",
};

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm text-white">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-white outline-none focus:border-[var(--color-accent)]"
      />
    </label>
  );
}

function Textarea({
  label,
  name,
  required = false,
  rows = 6,
}: {
  label: string;
  name: string;
  required?: boolean;
  rows?: number;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm text-white">
      {label}
      <textarea
        name={name}
        rows={rows}
        required={required}
        className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-white outline-none focus:border-[var(--color-accent)]"
      />
    </label>
  );
}

export default async function AdminPage() {
  await requireAdmin();

  const [committees, team, publicContent, applications] = await Promise.all([
    prisma.committee.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
    prisma.teamMember.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
    getPublicContent(),
    prisma.applicationSubmission.findMany({ orderBy: { createdAt: "desc" }, take: 100, select: { id: true, email: true, applicationType: true, payload: true, createdAt: true } }),
  ]);

  const settings = publicContent.settings || DEFAULT_SETTINGS;

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-10 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-accent)] font-bold">
              {settings.conference.shortName || "MUNAIR'27"}
            </p>
            <h1 className="text-4xl font-bold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/api/admin/applications/export" className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition">
              Export applications
            </Link>
            <form action={logoutAction}>
              <button className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition">
                Logout
              </button>
            </form>
            <form action={revokeAllSessionsAction}>
              <button className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold hover:border-red-300 hover:text-red-200 transition">
                Sign out all devices
              </button>
            </form>
          </div>
        </header>

        {/* Existing Committees and Team Member Cards */}
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-black/25 p-6">
            <h2 className="mb-4 text-2xl font-bold">Committees</h2>
            <div className="space-y-3">
              {committees.map((committee) => (
                <div key={committee.id} className="flex items-center justify-between gap-3 rounded-lg bg-white/5 px-4 py-3">
                  <div>
                    <p className="font-semibold">{committee.name}</p>
                    <p className="text-xs text-white/60">{committee.isPublished ? "Published" : "Draft"}</p>
                  </div>
                  <Link
                    className="rounded-md border border-white/20 px-3 py-1 text-sm font-semibold text-[var(--color-accent)] hover:border-[var(--color-accent)] hover:bg-white/5 transition"
                    href={`/admin/committees/${committee.id}`}
                  >
                    Edit
                  </Link>
                </div>
              ))}
              {committees.length === 0 && <p className="text-sm text-white/60">No committees yet.</p>}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/25 p-6">
            <h2 className="mb-4 text-2xl font-bold">Secretariat & Team</h2>
            <div className="space-y-3">
              {team.map((member) => (
                <div key={member.id} className="flex items-center justify-between gap-3 rounded-lg bg-white/5 px-4 py-3">
                  <div>
                    <p className="font-semibold">{member.name}</p>
                    {member.role && <p className="text-xs text-white/60">{member.role}</p>}
                  </div>
                  <Link
                    className="rounded-md border border-white/20 px-3 py-1 text-sm font-semibold text-[var(--color-accent)] hover:border-[var(--color-accent)] hover:bg-white/5 transition"
                    href={`/admin/team/${member.id}`}
                  >
                    Edit
                  </Link>
                </div>
              ))}
              {team.length === 0 && <p className="text-sm text-white/60">No team members yet.</p>}
            </div>
          </div>
        </section>

        <AdminApplicationInbox applications={applications.map((application) => ({ ...application, createdAt: application.createdAt.toISOString() }))} />

        {/* Creation Forms */}
        <section className="grid gap-6 lg:grid-cols-2">
          <form action={createCommitteeAction} className="flex flex-col gap-4 rounded-xl border border-white/10 bg-black/25 p-6">
            <h2 className="text-2xl font-bold">New Committee</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <NameAndSlugFields basePath="/committees" />
              <Field label="Sort Order" name="sortOrder" type="number" />
              <ImageUrlField name="imageUrl" id="committee-image-url" required />
            </div>
            <Textarea label="Description" name="description" required />
            <Textarea label="Documents, one per line: Title | URL" name="documents" rows={3} />
            <label className="flex items-center gap-2 text-sm text-white">
              <input name="isPublished" type="checkbox" defaultChecked />
              Published
            </label>
            <button className="rounded-lg bg-[var(--color-accent)] px-4 py-3 font-bold text-white hover:bg-white hover:text-black transition">
              Create Committee
            </button>
          </form>

          <form action={createTeamMemberAction} className="flex flex-col gap-4 rounded-xl border border-white/10 bg-black/25 p-6">
            <h2 className="text-2xl font-bold">New Secretariat / Team Member</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <NameAndSlugFields basePath="/team" />
              <Field label="Role" name="role" required />
              <Field label="Sort Order" name="sortOrder" type="number" />
              <ImageUrlField name="imageUrl" id="team-image-url" required />
              <Field label="Instagram URL" name="instagram" type="url" />
            </div>
            <Textarea label="Biography" name="bio" required />
            <label className="flex items-center gap-2 text-sm text-white">
              <input name="isPublished" type="checkbox" defaultChecked />
              Published
            </label>
            <button className="rounded-lg bg-[var(--color-accent)] px-4 py-3 font-bold text-white hover:bg-white hover:text-black transition">
              Create Member
            </button>
          </form>
        </section>

        {/* Site Settings Visual Editor */}
        <section id="conference-settings" className="flex flex-col gap-6">
          <div>
            <h2 className="text-3xl font-bold">Site Settings</h2>
            <p className="mt-2 text-sm text-white/65">
              Conference content, applications, letters, visibility, and form questions are managed here visually.
            </p>
          </div>
          <AdminSettingsForm settings={settings} action={saveConferenceSettingsAction} />
        </section>
      </div>
    </main>
  );
}
