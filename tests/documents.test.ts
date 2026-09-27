import assert from "node:assert/strict";
import test from "node:test";
import { isSafeDocumentUrl, parseDocuments } from "../lib/documents.ts";

test("parses committee guide links and accepts safe URLs", () => {
  assert.deepEqual(parseDocuments("DISEC Guide | https://example.com/disec.pdf\nLocal Guide | /guides/local.pdf"), [
    { title: "DISEC Guide", url: "https://example.com/disec.pdf" },
    { title: "Local Guide", url: "/guides/local.pdf" },
  ]);
  assert.equal(isSafeDocumentUrl("javascript:alert(1)"), false);
});
