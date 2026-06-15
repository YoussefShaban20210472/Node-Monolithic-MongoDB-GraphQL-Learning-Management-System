import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { graphqlRequest } from "../../utils/graphql-client.js";
import {
  commonInvalidValues,
  invalidAuthenicationSecinaros,
  invalidSchemaSecinaros,
} from "../../graphql/fixture/common-invalid.fixture.graphql.js";

export function testSchema(
  getInput: (field: string, value: unknown) => unknown,
  schema: string,
  requiredFields: readonly string[],
  getCookie: () => string,
) {
  describe("Schema Validation (Missing, Invalid)", () => {
    invalidSchemaSecinaros.forEach((secinaro) => {
      secinaro.values.forEach((value) => {
        requiredFields.forEach((field) => {
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
            expect(response.status).toBe(400);

            expect(response.body.errors).toBeDefined();
            expect(response.body.data).toBeUndefined();
          });
        });
      });
    });
  });
}
