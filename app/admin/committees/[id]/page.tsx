export const instant = false;
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteCommitteeAction, updateCommitteeAction } from "@/app/admin/actions";
import ImageUrlField from "@/components/admin/ImageUrlField";
import NameAndSlugFields from "@/components/admin/NameAndSlugFields";
import { stringifyDocuments } from "@/lib/documents";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Edit Committee | Admin",
  robots: "noindex",
};

export default async function EditCommitteePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const committeeId = Number(id);

  if (!Number.isInteger(committeeId)) notFound();

  const committee = await prisma.committee.findUnique({ where: { id: committeeId } });
  if (!committee) notFound();

  const updateAction = updateCommitteeAction.bind(null, committee.id);
  const deleteAction = deleteCommitteeAction.bind(null, committee.id);

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-10 text-white">
      <form action={updateAction} className="mx-auto flex max-w-3xl flex-col gap-4 rounded-xl border border-white/10 bg-black/25 p-6">
        <Link href="/admin" className="text-sm text-[var(--color-accent)] hover:underline">
          &larr; Back to dashboard
        </Link>
        <h1 className="text-3xl font-bold">Edit Committee</h1>
        <NameAndSlugFields basePath="/committees" nameValue={committee.name} slugValue={committee.slug} />
        <label className="flex flex-col gap-2 text-sm text-white">
          Sort Order
          <input
            name="sortOrder"
            type="number"
            defaultValue={committee.sortOrder}
            className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-white outline-none focus:border-[var(--color-accent)]"
          />
        </label>
        <ImageUrlField name="imageUrl" id="committee-image-url" defaultValue={committee.imageUrl || ""} required />
        <label className="flex flex-col gap-2 text-sm text-white">
          Description
          <textarea
            name="description"
            rows={10}
            defaultValue={committee.description}
            required
            className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-white outline-none focus:border-[var(--color-accent)]"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-white">
          Documents (one per line: Title | URL)
          <textarea
            name="documents"
            rows={4}
            defaultValue={stringifyDocuments(committee.documents)}
            className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-white outline-none focus:border-[var(--color-accent)]"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-white">
          <input name="isPublished" type="checkbox" defaultChecked={committee.isPublished} />
          Published
        </label>
        <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
          <button className="rounded-lg bg-[var(--color-accent)] px-6 py-3 font-bold text-white hover:bg-white hover:text-black transition">
            Save changes
          </button>
          <button
            formAction={deleteAction}
            className="rounded-lg border border-red-400/50 px-6 py-3 font-bold text-red-100 hover:bg-red-500/20 transition"
          >
            Delete
          </button>
        </div>
      </form>
    </main>
  );
}
