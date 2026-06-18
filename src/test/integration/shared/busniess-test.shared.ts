import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { test } from "./common-test.shared.js";

export function testBusniess(
  getInput: (field: string, value: unknown) => unknown,
  schema: string,
  requiredFields: readonly { name: string; type?: unknown }[],
  roles: { type: string; getCookie: () => string }[],
  commonInvalidValues: readonly unknown[],
  specificInvalidValues: Record<string, unknown[]>,
) {
  describe("Business Validation (Empty, Invalid)", () => {
    roles.forEach((role) => {
      requiredFields.forEach((field) => {
        const invalidBusniessSecinaros = [
          { type: "empty", values: [""] },
          {
            type: "invalid",
            values: [
              ...commonInvalidValues,
              ...specificInvalidValues[field.name],
            ],
          },
        ];
        invalidBusniessSecinaros.forEach((secinaro) => {
          secinaro.values.forEach((value) => {
            it(`Should return Bad Request if the ${field.name} is ${secinaro.type} (${value}) (${role.type})`, async () => {
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
