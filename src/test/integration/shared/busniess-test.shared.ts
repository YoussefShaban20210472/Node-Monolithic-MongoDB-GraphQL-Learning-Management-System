import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { test } from "./common-test.shared.js";
import { invalidGraphQLDomains } from "../../utils/value-builder.js";
import { graphqlDomains } from "../../graphql/fixture/graphql-domains.fixture.graphql.js";
import {
  invalidCourseDurationFields,
  invalidObjectDurationFields,
} from "../../utils/date-builder.js";

export function testBusniess(
  getInput: (field: string, value: unknown) => unknown,
  schema: string,
  requiredFields: readonly {
    name: string;
    type?: string;
    domain: graphqlDomains;
  }[],
  roles: { type: string; getCookie: () => string }[],
) {
  describe("Business Validation (Empty, Invalid)", () => {
    roles.forEach((role) => {
      requiredFields.forEach((field) => {
        testBusniessEmpty(getInput, schema, role, field.name, field.type);
        testBusniessInvalid(getInput, schema, role, field.name, field.domain);
      });
    });
  });
}

export function testBusniessEmpty(
  getInput: (field: string, value: unknown) => unknown,
  schema: string,
  role: { type: string; getCookie: () => string },
  field: string,
  fieldType: string | undefined,
) {
  if (fieldType === "String" || fieldType === undefined)
    it(`Should return Bad Request if the ${field} is empty ("") (${role.type})`, async () => {
      await test(
        getInput(field, ""),
        role.getCookie(),
        schema,
        200,
        "defined",
        "null",
        [],
      );
    });
}

export function testBusniessInvalid(
  getInput: (field: string, value: unknown) => unknown,
  schema: string,
  role: { type: string; getCookie: () => string },
  field: string,
  fieldDomain: graphqlDomains,
) {
  const values = invalidGraphQLDomains[fieldDomain];
  console.log(values);
  values.forEach((value) => {
    it(`Should return Bad Request if the ${field} is invalid (${value}) (${role.type})`, async () => {
      await test(
        getInput(field, value),
        role.getCookie(),
        schema,
        200,
        "defined",
        "null",
        [],
      );
    });
  });
}
export function testObjectNotFound(
  getInput: () => unknown,
  schema: string,
  roles: { type: string; getCookie: () => string }[],
) {
  describe("Should return Object Not Found if the object is not found", () => {
    roles.forEach((role) => {
      it(`Should return Object Not Found if the object is not found (${role.type})`, async () => {
        await test(
          getInput(),
          role.getCookie(),
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

export function testDuration(
  schema: string,
  getInput: (field: string, value: unknown) => object,
  roles: {
    type: string;
    getCookie: () => string;
  }[],
  type: "Course" | "Object" = "Object",
) {
  const requiredFields: { name: "startDate" | "endDate"; domain: "Date" }[] = [
    { name: "startDate", domain: "Date" },
    { name: "endDate", domain: "Date" },
  ];
  let invalidDuriationFields: {
    startDate: string[];
    endDate: string[];
  };
  if (type === "Course") {
    invalidDuriationFields = invalidCourseDurationFields;
  } else {
    invalidDuriationFields = invalidObjectDurationFields;
  }
  describe(`${type} Duration Validation`, () => {
    roles.forEach((role) => {
      requiredFields.forEach((field) => {
        const values = invalidDuriationFields[field.name];
        values.forEach((value) => {
          it(`Should return Bad Request if the ${field.name} is invalid (${value}) (${role.type})`, async () => {
            await test(
              getInput(field.name, value),
              role.getCookie(),
              schema,
              200,
              "defined",
              "null",
              [],
            );
          });
        });
      });
    });
  });
}
