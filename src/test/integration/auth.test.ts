import { describe, it, expect, beforeAll } from "vitest";
import {
  createRandomUserAndLoginAndGetCookie,
  createUserAndGetId,
  loginAndGetCookie,
} from "../utils/helper/user.helper.js";
import { adminLogin } from "../graphql/fixture/user.fixture.graphql.js";

import { createRandomUser } from "../utils/factory/user.factory.js";
import { testAuthenication } from "./shared/auth-test.shared.js";
import { test, testCommon } from "./shared/common-test.shared.js";
import { Response } from "supertest";
import { LOGIN, LOGOUT } from "../graphql/operation/auth.operation.graphql.js";

let adminCookie: string;
const roles = ["STUDENT", "INSTRUCTOR", "ADMIN"];
beforeAll(async () => {
  adminCookie = await loginAndGetCookie(adminLogin);
});

describe("Testing login", () => {
  const schema = LOGIN;
  describe("Positive", () => {
    roles.forEach((role) => {
      it(`Should ${role} logins`, async () => {
        const user = createRandomUser(role);
        await createUserAndGetId(user, adminCookie);
        const additionalTests = [
          (response: Response) => {
            expect(response.body.data.login).toMatchObject({
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              address: user.address,
              role: user.role,
            });
          },
          (response: Response) => {
            expect(response.body.data.login._id).toBeDefined();
          },
        ];
        await test(
          { email: user.email, password: user.password },
          "",
          schema,
          200,
          "undefined",
          "defined",
          additionalTests,
        );
      });
    });
  });

  describe("Negative", () => {
    const rolesLocal = [{ type: "", getCookie: () => "" }];
    const user = createRandomUser();
    const requiredFields = [
      { name: "email", domain: "Email" },
      { name: "password", domain: "Password" },
    ] as const;
    testCommon(
      schema,
      () => ({ email: user.email, password: user.password }),
      [],
      requiredFields,
      rolesLocal,
      [],
      { authenication: false, authorization: false },
    );
  });
});

describe("Testing logout", () => {
  const schema = LOGOUT;
  describe("Positive", () => {
    roles.forEach((role) => {
      it(`Should ${role} logouts`, async () => {
        const cookie = await createRandomUserAndLoginAndGetCookie(
          role,
          adminCookie,
        );
        const additionalTests = [
          (response: Response) => {
            expect(response.body.data.logout).toBe(true);
          },
        ];
        await test(
          undefined,
          cookie,
          schema,
          200,
          "undefined",
          "defined",
          additionalTests,
        );
      });
    });
  });
  describe("Negative", () => {
    testAuthenication(() => undefined, schema);
  });
});
