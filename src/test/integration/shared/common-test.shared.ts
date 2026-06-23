import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { graphqlRequest } from "../../utils/graphql-client.js";
import { Response } from "supertest";
import { testAuthenication, testAuthorization } from "./auth-test.shared.js";
import { testSchema } from "./schema-test.shared.js";
import { testBusniess, testObjectNotFound } from "./busniess-test.shared.js";
import { graphqlTypes } from "../../graphql/fixture/graphql-types.fixture.graphql.js";

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

export function testCommon(
  schema: string,
  getInput: () => object,
  invalidAuthorizationSecinaros: {
    type: string;
    getCookie: () => string;
  }[],
  requiredFields: readonly { name: string; type?: graphqlTypes }[],
  roles: {
    type: string;
    getCookie: () => string;
  }[],
  objectsNotFound: string[],
  commonInvalidValues: readonly unknown[],
  specificInvalidValues: Record<string, unknown[]>,
  allow: {
    authenication?: boolean;
    authorization?: boolean;
    schema?: boolean;
    busniess?: boolean;
    notFound?: boolean;
    allowMissing?: boolean;
  } = {},
) {
  // let getInput2: (field: string, value: unknown) => unknown;
  if (allow.authenication !== false) testAuthenication(getInput, schema);
  if (allow.authorization !== false)
    testAuthorization(getInput, schema, invalidAuthorizationSecinaros);
  if (allow.schema !== false)
    testSchema(
      (field: string, value: unknown) => ({
        ...getInput(),
        [field]: value,
      }),
      schema,
      requiredFields,
      roles,
      allow.allowMissing,
    );
  if (allow.busniess !== false)
    testBusniess(
      (field: string, value: unknown) => ({
        ...getInput(),
        [field]: value,
      }),
      schema,
      requiredFields,
      roles,
      commonInvalidValues,
      specificInvalidValues,
    );
  if (allow.notFound !== false)
    for (let object of objectsNotFound) {
      testObjectNotFound(
        () => ({
          ...getInput(),
          [object]: `QQ39655165fa16743197e17e`,
        }),
        schema,
        roles,
      );
    }
}
