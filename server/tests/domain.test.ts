import assert from "node:assert/strict";
import test from "node:test";
import { normalizeSkillNames, skillMatchPercent } from "../skills";

test("normalizeSkillNames trims, normalizes whitespace, and deduplicates case-insensitively", () => {
  assert.deepEqual(
    normalizeSkillNames([" React ", "react", "TypeScript  Basics", "", null, 4]),
    ["react", "typescript basics"]
  );
});

test("skillMatchPercent compares case-insensitively and rounds the percentage", () => {
  assert.equal(skillMatchPercent(["React", "SQL", "Python"], ["react", "python"]), 67);
  assert.equal(skillMatchPercent(["React"], []), 0);
});

test("skillMatchPercent treats a project without required skills as a full match", () => {
  assert.equal(skillMatchPercent([], []), 100);
});
