import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { graphqlRequest } from "../../utils/graphql-client.js";

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
            const variables = {
              input: getInput(field, value),
            };
            let response = await graphqlRequest()
              .set("Cookie", getCookie())
              .send({
                query: schema,
                variables,
              });
            console.log(response.body);
            expect(response.status).toBe(200);

            expect(response.body.errors).toBeDefined();
            expect(response.body.data).toBeNull();
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
      const variables = {
        input: getInput(),
      };
      const response = await graphqlRequest().set("Cookie", getCookie()).send({
        query: schema,
        variables,
      });
      expect(response.status).toBe(200);

      expect(response.body.errors).toBeDefined();
      expect(response.body.data).toBeNull();
    });
  });
}
