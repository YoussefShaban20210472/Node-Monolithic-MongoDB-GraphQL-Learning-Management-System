import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { missingValues } from "../../graphql/fixture/common-invalid.fixture.graphql.js";
import { test } from "./common-test.shared.js";
import {
  invalidGraphQLTypes,
  graphqlTypes,
} from "../../graphql/fixture/graphql-types.fixture.graphql.js";

export function testSchema(
  getInput: (field: string, value: unknown) => unknown,
  schema: string,
  requiredFields: readonly { name: string; type?: graphqlTypes }[],
  roles: { type: string; getCookie: () => string }[],
  allowMissing: boolean = false,
) {
  describe("Schema Validation (Missing, Invalid)", () => {
    roles.forEach((role) => {
      requiredFields.forEach((field) => {
        testSchemaMissing(getInput, schema, role, field.name, allowMissing);
        testSchemaInvalid(getInput, schema, role, field.name, field.type);
      });
    });
  });
}

function testSchemaMissing(
  getInput: (field: string, value: unknown) => unknown,
  schema: string,
  role: { type: string; getCookie: () => string },
  field: string,
  allowMissing: boolean = false,
) {
  if (allowMissing === true) return;
  missingValues.forEach((value) => {
    testSchemaCommon(getInput, schema, role, field, "missing", value);
  });
}
function testSchemaInvalid(
  getInput: (field: string, value: unknown) => unknown,
  schema: string,
  role: { type: string; getCookie: () => string },
  field: string,
  fieldType?: graphqlTypes,
) {
  invalidGraphQLTypes[fieldType || "String"].forEach((value) => {
    testSchemaCommon(getInput, schema, role, field, "invalid", value);
  });
}

function testSchemaCommon(
  getInput: (field: string, value: unknown) => unknown,
  schema: string,
  role: { type: string; getCookie: () => string },
  field: string,
  type: string,
  value: unknown,
) {
  it(`Should return Bad Request if the ${field} is ${type} (${value}) (${role.type})`, async () => {
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
}
