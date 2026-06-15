import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { graphqlRequest } from "../utils/graphql-client.js";
import {
  createRandomUserAndGetId,
  createUserAndGetId,
  loginAndGetCookie,
} from "../utils/helper/user.helper.js";
import {
  adminLogin,
  adminUser,
  instructorLogin,
  requiredUserFields,
  studentLogin,
} from "../graphql/fixture/user.fixture.graphql.js";
import {
  CREATE_USER,
  DELETE_USER_BY_ID,
  GET_USER_BY_ID,
} from "../graphql/operation/user.operation.graphql.js";
import { createRandomUser } from "../utils/factory/user.factory.js";
import {
  commonInvalidUserValues,
  specificInvalidUserValues,
} from "../graphql/fixture/user-invalid.fixture.graphql.js";
import {
  testAuthenication,
  testAuthorization,
} from "./shared/auth-test.shared.js";
import { testSchema } from "./shared/schema-test.shared.js";
import {
  testBusniess,
  testObjectNotFound,
} from "./shared/busniess-test.shared.js";

let adminCookie: string;
let instructorCookie: string;
let studentCookie: string;
let userId: string;
const roles = ["STUDENT", "INSTRUCTOR", "ADMIN"];

beforeAll(async () => {
  adminCookie = await loginAndGetCookie(adminLogin);
  instructorCookie = await loginAndGetCookie(instructorLogin);
  studentCookie = await loginAndGetCookie(studentLogin);
  userId = await createRandomUserAndGetId("STUDENT", adminCookie);
});
describe("Testing User Creation", () => {
  describe("Positive", () => {
    roles.forEach((role) => {
      it(`Should an admin create ${role} user`, async () => {
        const user = createRandomUser(role);

        const variables = {
          input: user,
        };
        const response = await graphqlRequest()
          .set("Cookie", adminCookie)
          .send({
            query: CREATE_USER,
            variables,
          });
        expect(response.status).toBe(200);

        expect(response.body.errors).toBeUndefined();

        expect(response.body.data.createUser).toMatchObject({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          address: user.address,
          role: user.role,
        });

        expect(response.body.data.createUser._id).toBeDefined();
      });
    });
  });

  describe("Negative", () => {
    const invalidAuthorizationSecinaros = [
      { type: "instructor", getCookie: () => instructorCookie },
      { type: "student", getCookie: () => studentCookie },
    ];
    const schema = CREATE_USER;
    const getCookie = () => adminCookie;
    const user = createRandomUser();
    testAuthenication(() => user, schema);
    testAuthorization(
      () => createRandomUser(),
      schema,
      invalidAuthorizationSecinaros,
    );
    testSchema(
      (field: string, value: unknown) => ({
        ...user,
        [field]: value,
      }),
      schema,
      requiredUserFields,
      getCookie,
    );
    testBusniess(
      (field: string, value: unknown) => ({
        ...user,
        [field]: value,
      }),
      schema,
      requiredUserFields,
      getCookie,
      commonInvalidUserValues,
      specificInvalidUserValues,
    );
    describe("Should reject duplicate email/phoneNumber", () => {
      const temp = createRandomUser();
      const duplicates: (keyof typeof temp)[] = ["email", "phoneNumber"];
      roles.forEach((role) => {
        duplicates.forEach((duplicate) => {
          it(`Should reject duplicate (${duplicate}) (${role})`, async () => {
            const newUser = createRandomUser(role);
            const variables = {
              input: newUser,
            };
            variables.input[duplicate] = adminUser[duplicate] || "";

            let response = await graphqlRequest()
              .set("Cookie", adminCookie)
              .send({
                query: CREATE_USER,
                variables,
              });
            expect(response.status).toBe(200);
            expect(response.body.errors).toBeDefined();
            expect(response.body.data).toBeNull();
          });
        });
      });
    });
  });
});

describe("Testing delete User By Id", () => {
  describe("Positive", () => {
    roles.forEach((role) => {
      it(`Should an admin delete ${role} user by id`, async () => {
        const user = createRandomUser(role);
        const _id = await createUserAndGetId(user, adminCookie);
        const variables = {
          input: _id,
        };
        const response = await graphqlRequest()
          .set("Cookie", adminCookie)
          .send({
            query: DELETE_USER_BY_ID,
            variables,
          });
        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.errors).toBeUndefined();

        expect(response.body.data.deleteUserById).toBe(true);
      });
    });
  });

  describe("Negative", () => {
    const invalidAuthorizationSecinaros = [
      { type: "instructor", getCookie: () => instructorCookie },
      { type: "student", getCookie: () => studentCookie },
    ];
    const schema = DELETE_USER_BY_ID;
    const getCookie = () => adminCookie;
    testAuthenication(() => userId, schema);
    testAuthorization(() => userId, schema, invalidAuthorizationSecinaros);
    testSchema(
      (field: string, value: unknown) => value,
      schema,
      ["_id"],
      getCookie,
    );
    testBusniess(
      (field: string, value: unknown) => value,
      schema,
      ["_id"],
      getCookie,
      commonInvalidUserValues,
      { _id: [] },
    );
    testObjectNotFound(() => `QQ${userId.slice(2)}`, schema, getCookie);
  });
});

describe("Testing get User By Id", () => {
  describe("Positive", () => {
    roles.forEach((role) => {
      it(`Should an admin get ${role} user by id`, async () => {
        const user = createRandomUser(role);
        const _id = await createUserAndGetId(user, adminCookie);
        const variables = {
          input: _id,
        };
        const response = await graphqlRequest()
          .set("Cookie", adminCookie)
          .send({
            query: GET_USER_BY_ID,
            variables,
          });

        expect(response.status).toBe(200);
        expect(response.body.errors).toBeUndefined();
        expect(response.body.data.getUserById).toMatchObject({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          address: user.address,
          role: user.role,
        });
        expect(response.body.data.getUserById._id).toBeDefined();
      });
    });
  });

  describe("Negative", () => {
    const invalidAuthorizationSecinaros = [
      { type: "instructor", getCookie: () => instructorCookie },
      { type: "student", getCookie: () => studentCookie },
    ];
    const schema = GET_USER_BY_ID;
    const getCookie = () => adminCookie;
    testAuthenication(() => userId, schema);
    testAuthorization(() => userId, schema, invalidAuthorizationSecinaros);
    testSchema(
      (field: string, value: unknown) => value,
      schema,
      ["_id"],
      getCookie,
    );
    testBusniess(
      (field: string, value: unknown) => value,
      schema,
      ["_id"],
      getCookie,
      commonInvalidUserValues,
      { _id: [] },
    );
    testObjectNotFound(() => `QQ${userId.slice(2)}`, schema, getCookie);
  });
});
