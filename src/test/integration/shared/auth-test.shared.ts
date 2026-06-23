import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { invalidAuthenicationSecinaros } from "../../graphql/fixture/common-invalid.fixture.graphql.js";
import { test } from "./common-test.shared.js";

export function testAuthenication(getInput: () => unknown, schema: string) {
  describe("Authenication Validation (Empty, Invalid)", () => {
    invalidAuthenicationSecinaros.forEach((secinaro) => {
      secinaro.value.forEach((value) => {
        it(`Should return 'require login' if the authenication is (${secinaro.type}) (${secinaro.value})`, async () => {
          await test(getInput(), value, schema, 200, "defined", "null", []);
        });
      });
    });
  });
}
export function testAuthorization(
  getInput: () => unknown,
  schema: string,
  invalidAuthorizationSecinaros: {
    type: string;
    getCookie: () => string;
  }[],
) {
  if (invalidAuthorizationSecinaros.length === 0) return;
  describe("Authorization Validation (Unauthorized)", () => {
    invalidAuthorizationSecinaros.forEach((secinaro) => {
      it(`Should return Forbidden if the authorization is rejected (${secinaro.type})`, async () => {
        await test(
          getInput(),
          secinaro.getCookie(),
          schema,
          200,
          "defined",
          "null",
          [],
        );
      });
    });
  });
}
