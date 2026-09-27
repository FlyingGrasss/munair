import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_SETTINGS } from "../config/conference.ts";
import { getApplicationHref, getApplicationsDestination } from "../lib/applications/availability.ts";

test("closed applications use the configured destination everywhere", () => {
  const settings = structuredClone(DEFAULT_SETTINGS);
  settings.applicationsClosed = true;
  settings.applicationsClosedUrl = "https://example.com/applications-closed";

  assert.equal(getApplicationsDestination(settings), "https://example.com/applications-closed");
  assert.equal(getApplicationHref(settings, "delegate"), "https://example.com/applications-closed");
});

test("invalid closed destinations fall back to the applications section", () => {
  const settings = structuredClone(DEFAULT_SETTINGS);
  settings.applicationsClosed = true;
  settings.applicationsClosedUrl = "javascript:alert(1)";

  assert.equal(getApplicationsDestination(settings), "/#applications");
});
