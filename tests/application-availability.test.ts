import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_SETTINGS } from "../config/conference.ts";
import { getApplicationHref, getApplicationsDestination, getExternalApplicationDestination } from "../lib/applications/availability.ts";

test("closed applications fall back to the applications section", () => {
  const settings = structuredClone(DEFAULT_SETTINGS);
  settings.applicationsClosed = true;

  assert.equal(getApplicationsDestination(), "/#applications");
  assert.equal(getApplicationHref(settings, "delegate"), "/#applications");
});

test("an application can use its own safe external form URL", () => {
  const settings = structuredClone(DEFAULT_SETTINGS);
  settings.applications[0].externalLinkEnabled = true;
  settings.applications[0].externalUrl = "https://forms.google.com/example";

  assert.equal(getExternalApplicationDestination(settings, "delegate"), "https://forms.google.com/example");
  assert.equal(getApplicationHref(settings, "delegate"), "https://forms.google.com/example");
  assert.equal(getApplicationHref(settings, "chair"), "/apply/chair");
});

test("invalid external form URLs stay on the on-site route", () => {
  const settings = structuredClone(DEFAULT_SETTINGS);
  settings.applications[0].externalLinkEnabled = true;
  settings.applications[0].externalUrl = "javascript:alert(1)";

  assert.equal(getExternalApplicationDestination(settings, "delegate"), null);
  assert.equal(getApplicationHref(settings, "delegate"), "/apply/delegate");
});
