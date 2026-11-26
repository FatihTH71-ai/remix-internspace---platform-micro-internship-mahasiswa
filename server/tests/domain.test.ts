import assert from "node:assert/strict";
import test from "node:test";
import { normalizeSkillNames, skillMatchPercent } from "../skills";
import { getAllowedFrontendOrigins, isAllowedFrontendOrigin } from "../origins";
import { databaseConnectionErrorMessage, isDatabaseConnectionError } from "../errors";
import { getMidtransHttpStatus, validateMidtransCredentials } from "../midtrans";

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

test("development accepts Vite's fallback localhost origin without widening production CORS", () => {
  const developmentOrigins = getAllowedFrontendOrigins("http://localhost:3000", "development");
  const productionOrigins = getAllowedFrontendOrigins("https://internspace.example", "production");

  assert.equal(isAllowedFrontendOrigin("http://localhost:3001", developmentOrigins), true);
  assert.equal(isAllowedFrontendOrigin("https://attacker.example", developmentOrigins), false);
  assert.equal(isAllowedFrontendOrigin("http://localhost:3001", productionOrigins), false);
  assert.equal(isAllowedFrontendOrigin("https://internspace.example", productionOrigins), true);
});

test("database credential and connection failures are identified for safe API responses", () => {
  assert.equal(isDatabaseConnectionError({ code: "ER_ACCESS_DENIED_ERROR" }), true);
  assert.equal(isDatabaseConnectionError({ code: "ECONNREFUSED" }), true);
  assert.equal(isDatabaseConnectionError({ code: "ER_DUP_ENTRY" }), false);
  assert.equal(isDatabaseConnectionError(new Error("unrelated error")), false);
  assert.match(
    databaseConnectionErrorMessage({ code: "ER_ACCESS_DENIED_ERROR" }),
    /MySQL rejected the configured database account/
  );
  assert.match(
    databaseConnectionErrorMessage({ code: "ECONNREFUSED" }),
    /Check MYSQL_HOST, MYSQL_PORT/
  );
});

test("Midtrans credentials must match the configured sandbox or production environment", () => {
  assert.deepEqual(
    validateMidtransCredentials("SB-Mid-server-test", "SB-Mid-client-test", false),
    { serverKey: "SB-Mid-server-test", clientKey: "SB-Mid-client-test" }
  );
  assert.deepEqual(
    validateMidtransCredentials("Mid-server-test", "Mid-client-test", true),
    { serverKey: "Mid-server-test", clientKey: "Mid-client-test" }
  );
  assert.throws(
    () => validateMidtransCredentials("SB-Mid-server-test", "Mid-client-test", false),
    /keys do not match sandbox mode/
  );
  assert.throws(
    () => validateMidtransCredentials(undefined, "SB-Mid-client-test", false),
    /server and client keys must both be configured/
  );
});

test("Midtrans HTTP errors expose only a numeric status for sanitized handling", () => {
  assert.equal(getMidtransHttpStatus({ httpStatusCode: 401 }), 401);
  assert.equal(getMidtransHttpStatus({ httpStatusCode: "401" }), undefined);
  assert.equal(getMidtransHttpStatus(new Error("provider error")), undefined);
});
