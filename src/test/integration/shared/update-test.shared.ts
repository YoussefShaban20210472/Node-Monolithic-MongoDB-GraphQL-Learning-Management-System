import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { invalidSchemaSecinaros } from "../../graphql/fixture/common-invalid.fixture.graphql.js";
import { test } from "./common-test.shared.js";
import { Response } from "supertest";

export function testUpdateManyFields(
  getInput: () => unknown,
  schema: string,
  schemaFunction: string,
  roles: { type: string; getCookie: () => string }[],
) {
  const additionalTests = [
    (response: Response) => {
      expect(response.body.data[schemaFunction]).toBe(true);
    },
  ];
  describe("Update many fields", () => {
    roles.forEach((role) => {
      it(`Should ${role.type} update all object fields`, async () => {
        await test(
          getInput(),
          role.getCookie(),
          schema,
          200,
          "undefined",
          "defined",
          additionalTests,
        );
      });
    });
  });
}

export function testUpdateOneField<TUpdateFields>(
  getInput: (field: TUpdateFields) => unknown,
  schema: string,
  schemaFunction: string,
  roles: { type: string; getCookie: () => string }[],
  updateFields: readonly TUpdateFields[],
) {
  const additionalTests = [
    (response: Response) => {
      expect(response.body.data[schemaFunction]).toBe(true);
    },
  ];
  describe("Update one field", () => {
    roles.forEach((role) => {
      updateFields.forEach((field) => {
        it(`Should ${role.type} update only one object field (${field})`, async () => {
          await test(
            getInput(field),
            role.getCookie(),
            schema,
            200,
            "undefined",
            "defined",
            additionalTests,
          );
        });
      });
    });
  });
}
