import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { graphqlRequest } from "../../utils/graphql-client.js";
import { Response } from "supertest";
import { testAuthenication, testAuthorization } from "./auth-test.shared.js";
import { testSchema } from "./schema-test.shared.js";
import {
  testBusniess,
  testBusniessInvalid,
  testDuration,
  testObjectNotFound,
} from "./busniess-test.shared.js";
import { graphqlTypes } from "../../graphql/fixture/graphql-types.fixture.graphql.js";
import { graphqlDomains } from "../../graphql/fixture/graphql-domains.fixture.graphql.js";
import {
  invalidCourseDurationFields,
  invalidObjectDurationFields,
} from "../../utils/date-builder.js";

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
  // console.log(response.body);
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
  requiredFields: readonly {
    name: string;
    type?: graphqlTypes;
    domain: graphqlDomains;
  }[],
  roles: {
    type: string;
    getCookie: () => string;
  }[],
  objectsNotFound: string[],
  allow: {
    authenication?: boolean;
    authorization?: boolean;
    schema?: boolean;
    busniess?: boolean;
    allowMissing?: boolean;
    duration?: boolean;
    durationType?: "Course" | "Object";
  } = {},
  durationType?: "Course" | "Object",
) {
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
    );

  if (allow.duration === true)
    testDuration(
      schema,
      (field: string, value: unknown) => ({
        ...getInput(),
        [field]: value,
      }),
      roles,
      durationType,
    );
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
