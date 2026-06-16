import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { test } from "./common-test.shared.js";

export function testBusniess(
  getInput: (field: string, value: unknown) => unknown,
  schema: string,
  requiredFields: readonly string[],
  getCookie: () => string,
  commonInvalidValues: readonly unknown[],
  specificInvalidValues: Record<string, unknown[]>,
) {
  describe("Business Validation (Empty, Invalid)", () => {
    requiredFields.forEach((field) => {
      const invalidBusniessSecinaros = [
        { type: "empty", values: [""] },
        {
          type: "invalid",
          values: [...commonInvalidValues, ...specificInvalidValues[field]],
        },
      ];
      invalidBusniessSecinaros.forEach((secinaro) => {
        secinaro.values.forEach((value) => {
          it(`Should return Bad Request if the ${field} is ${secinaro.type} (${value})`, async () => {
            await test(
              getInput(field, value),
              getCookie(),
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

export function testObjectNotFound(
  getInput: () => unknown,
  schema: string,
  getCookie: () => string,
) {
  describe("Should return Object Not Found if the object is not found", () => {
    it(`Should return Object Not Found if the object is not found`, async () => {
      await test(getInput(), getCookie(), schema, 200, "defined", "null", []);
    });
  });
}
