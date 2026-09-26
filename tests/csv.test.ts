import assert from "node:assert/strict";
import test from "node:test";
import { csvCell, submissionsToCsv } from "../lib/csv.ts";

test("csvCell quotes values and neutralizes spreadsheet formulas", () => {
  assert.equal(csvCell('hello, "world"'), '"hello, ""world"""');
  assert.equal(csvCell("=SUM(A1:A2)"), `"'=SUM(A1:A2)"`);
});

test("submissionsToCsv emits stable headers and ISO timestamps", () => {
  const result = submissionsToCsv([{ id: "a1", applicationType: "delegate", email: "delegate@example.com", payload: { fullName: "Ada" }, createdAt: new Date("2027-01-02T03:04:05.000Z") }]);
  assert.match(result, /"applicationType"/);
  assert.match(result, /"2027-01-02T03:04:05.000Z"/);
  assert.match(result, /"\{""fullName"":""Ada""\}"/);
});
