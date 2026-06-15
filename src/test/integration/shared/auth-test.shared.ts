import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { graphqlRequest } from "../../utils/graphql-client.js";
import { invalidAuthenicationSecinaros } from "../../graphql/fixture/common-invalid.fixture.graphql.js";

export function testAuthenication(input: () => unknown, schema: string) {
  describe("Authenication Validation (Empty, Invalid)", () => {
    invalidAuthenicationSecinaros.forEach((secinaro) => {
      secinaro.value.forEach((value) => {
        it(`Should return 'require login' if the authenication is (${secinaro.type}) (${secinaro.value})`, async () => {
          const variables = {
            input: input(),
          };
          let response = await graphqlRequest().set("Cookie", value).send({
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
}
export function testAuthorization(
  input: () => unknown,
  schema: string,
  invalidAuthorizationSecinaros: {
    type: string;
    getCookie: () => string;
  }[],
) {
  describe("Authorization Validation (Unauthorized)", () => {
    invalidAuthorizationSecinaros.forEach((secinaro) => {
      it(`Should return Forbidden if the authorization is rejected (${secinaro.type})`, async () => {
        const variables = {
          input: input(),
        };
        let response = await graphqlRequest()
          .set("Cookie", secinaro.getCookie())
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
}
