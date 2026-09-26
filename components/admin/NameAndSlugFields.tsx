"use client";

import { useState } from "react";
import { toSlug } from "@/lib/slug";

export default function NameAndSlugFields({
  basePath,
  nameValue = "",
  slugValue = "",
}: {
  basePath: "/committees" | "/team";
  nameValue?: string;
  slugValue?: string;
}) {
  const [name, setName] = useState(nameValue);
  const [slug, setSlug] = useState(slugValue);
  const previewSlug = slug.trim() || toSlug(name) || "your-slug";

  return (
    <>
      <label className="flex flex-col gap-2 text-sm text-white">
        Name
        <input
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-white outline-none focus:border-[var(--color-accent)]"
        />
      </label>
      <label className="flex flex-col gap-2 text-sm text-white">
        Link / Slug
        <input
          name="slug"
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-white outline-none focus:border-[var(--color-accent)]"
        />
        <span className="text-xs text-white/60">
          This becomes the URL path. Leave blank to generate from the name.
        </span>
        <span className="text-xs text-[var(--color-accent)]">
          Page URL: {basePath}/{previewSlug}
        </span>
      </label>
    </>
  );
}
