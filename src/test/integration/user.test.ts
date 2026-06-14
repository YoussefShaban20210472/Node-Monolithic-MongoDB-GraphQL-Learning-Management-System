import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { graphqlRequest } from "../utils/graphql-client.js";
import { loginAndGetCookie } from "../utils/helper/user.helper.js";
import {
  adminLogin,
  adminUser,
  instructorLogin,
  requiredUserFields,
  studentLogin,
} from "../graphql/fixture/user.fixture.graphql.js";
import { CREATE_USER } from "../graphql/operation/user.operation.graphql.js";
import { createRandomUser } from "../utils/factory/user.factory.js";
import { commonInvalidValues } from "../graphql/fixture/common-invalid.fixture.graphql.js";
import {
  commonInvalidUserValues,
  invalidUserFieldsValues,
} from "../graphql/fixture/user-invalid.fixture.graphql.js";

let adminCookie: string;
let instructorCookie: string;
let studentCookie: string;
beforeAll(async () => {
  adminCookie = await loginAndGetCookie(adminLogin);
  instructorCookie = await loginAndGetCookie(instructorLogin);
  studentCookie = await loginAndGetCookie(studentLogin);
});
describe("Testing User Creation", () => {
  const roles = ["STUDENT", "INSTRUCTOR", "ADMIN"];
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
    describe("Authenication Validation (Empty, Invalid)", () => {
      const secinaros = [
        { type: "empty", value: [""] },
        { type: "invalid", value: ["adsadasdsad", "invalid-session"] },
      ];
      secinaros.forEach((secinaro) => {
        secinaro.value.forEach((value) => {
          roles.forEach((role) => {
            it(`Should return Unauthorized if the authenication is (${secinaro.type}) (${role})`, async () => {
              const user = createRandomUser(role);
              const variables = {
                input: user,
              };
              let response = await graphqlRequest().set("Cookie", value).send({
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
    describe("Authorization Validation (Unauthorized)", () => {
      const secinaros = [
        { type: "instructor", getCookie: () => instructorCookie },
        { type: "student", getCookie: () => studentCookie },
      ];
      secinaros.forEach((secinaro) => {
        roles.forEach((role) => {
          it(`Should return Forbidden if the authorization is rejected (${secinaro.type}) (${role})`, async () => {
            const user = createRandomUser(role);
            const variables = {
              input: user,
            };
            let response = await graphqlRequest()
              .set("Cookie", secinaro.getCookie())
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
    describe("User Creation Schema Validation (Missing, Invalid)", () => {
      const secinaros = [
        { type: "missing", values: [undefined] },
        { type: "invalid", values: commonInvalidValues },
      ];
      const user = createRandomUser();
      secinaros.forEach((secinaro) => {
        secinaro.values.forEach((value) => {
          requiredUserFields.forEach((field) => {
            it(`Should return Bad Request if the ${field} is ${secinaro.type} (${value})`, async () => {
              const variables = {
                input: { ...user, [field]: value },
              };
              let response = await graphqlRequest()
                .set("Cookie", adminCookie)
                .send({
                  query: CREATE_USER,
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

    describe("User Creation Business Validation (Empty, Invalid)", () => {
      const secinaros = [
        { type: "empty", values: [""] },
        { type: "invalid", values: commonInvalidUserValues },
      ];
      const user = createRandomUser();
      requiredUserFields.forEach((field) => {
        secinaros.forEach((secinaro) => {
          let values = [
            ...commonInvalidUserValues,
            ...invalidUserFieldsValues[field],
          ];
          values.forEach((value) => {
            it(`Should return Bad Request if the ${field} is ${secinaro.type} (${value})`, async () => {
              const variables = {
                input: { ...user, [field]: value },
              };
              let response = await graphqlRequest()
                .set("Cookie", adminCookie)
                .send({
                  query: CREATE_USER,
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
  });
});
