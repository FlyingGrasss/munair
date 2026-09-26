import assert from "node:assert/strict";
import test from "node:test";
import { toSlug } from "../lib/slug.ts";

test("creates stable, URL-safe slugs for Turkish names", () => {
  assert.equal(toSlug("İzmir & Buca Bilim"), "izmir-buca-bilim");
  assert.equal(toSlug("  UN Women  "), "un-women");
});
