import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { graphqlRequest } from "../../utils/graphql-client.js";
import { Response } from "supertest";

export async function test(
  input: unknown,
  cookie: string,
  schema: string,
  statusCode: number,
  errorsCase: string,
  dataCase: string,
  additionalTests: ((response: Response) => void)[],
) {
  const variables = {
    input: input,
  };
  const response = await graphqlRequest().set("Cookie", cookie).send({
    query: schema,
    variables,
  });
  const errors = response.body.errors;
  const data = response.body.data;
  const status = response.status;
  console.log(response.body);
  expect(status).toBe(statusCode);
  switch (errorsCase) {
    case "defined":
      expect(errors).toBeDefined();
      break;
    case "undefined":
      expect(errors).toBeUndefined();
      break;
    default:
      break;
  }
  switch (dataCase) {
    case "defined":
      expect(data).toBeDefined();
      break;
    case "undefined":
      expect(data).toBeUndefined();
      break;
    case "null":
      expect(data).toBeNull();
      break;
    default:
      break;
  }
  for (let additional of additionalTests) {
    additional(response);
  }
}
