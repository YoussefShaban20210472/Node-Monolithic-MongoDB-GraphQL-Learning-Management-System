import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { invalidSchemaSecinaros } from "../../graphql/fixture/common-invalid.fixture.graphql.js";
import { test } from "./common-test.shared.js";

export function testSchema(
  getInput: (field: string, value: unknown) => unknown,
  schema: string,
  requiredFields: readonly string[],
  roles: { type: string; getCookie: () => string }[],
  allowMissing: boolean = false,
) {
  let SchemaSecinaros;
  if (allowMissing) {
    SchemaSecinaros = [
      { type: "invalid", values: invalidSchemaSecinaros[1].values.slice(2) },
    ];
  } else {
    SchemaSecinaros = invalidSchemaSecinaros;
  }
  describe("Schema Validation (Missing, Invalid)", () => {
    roles.forEach((role) => {
      SchemaSecinaros.forEach((secinaro) => {
        secinaro.values.forEach((value) => {
          requiredFields.forEach((field) => {
            it(`Should return Bad Request if the ${field} is ${secinaro.type} (${value}) (${role.type})`, async () => {
              await test(
                getInput(field, value),
                role.getCookie(),
                schema,
                400,
                "defined",
                "undefined",
                [],
              );
            });
          });
        });
      });
    });
  });
}
