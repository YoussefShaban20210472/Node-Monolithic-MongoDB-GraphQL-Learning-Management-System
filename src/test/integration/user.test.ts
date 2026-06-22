import { describe, it, expect, beforeAll } from "vitest";
import {
  createRandomUserAndGetId,
  createRandomUserAndLoginAndGetCookie,
  createUserAndGetId,
  createUserAndLoginAndGetCookie,
  loginAndGetCookie,
} from "../utils/helper/user.helper.js";
import {
  adminLogin,
  adminUser,
  instructorLogin,
  requiredUserFields,
  studentLogin,
  updateUserFields,
} from "../graphql/fixture/user.fixture.graphql.js";
import {
  CREATE_USER,
  DELETE_ME,
  DELETE_USER_BY_ID,
  GET_ALL_USERS,
  GET_ME,
  GET_USER_BY_ID,
  UPDATE_ME,
  UPDATE_USER_BY_ID,
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
import { test } from "./shared/common-test.shared.js";
import { Response } from "supertest";
import {
  testUpdateManyFields,
  testUpdateOneField,
} from "./shared/update-test.shared.js";

let adminCookie: string;
let instructorCookie: string;
let studentCookie: string;
let userId: string;
const roles = ["STUDENT", "INSTRUCTOR", "ADMIN"];
const invalidAuthorizationSecinaros = [
  { type: "instructor", getCookie: () => instructorCookie },
  { type: "student", getCookie: () => studentCookie },
];
const idField = [{ name: "_id" }] as const;
const idSpecificInvalidField = { _id: [] };
beforeAll(async () => {
  adminCookie = await loginAndGetCookie(adminLogin);
  instructorCookie = await loginAndGetCookie(instructorLogin);
  studentCookie = await loginAndGetCookie(studentLogin);
  userId = await createRandomUserAndGetId("STUDENT", adminCookie);
});

async function testDuplicates(
  getInput: (duplicate: "email" | "phoneNumber") => unknown,
  schema: string,
  roles: { type: string; getCookie: () => string }[],
) {
  const duplicates: ("email" | "phoneNumber")[] = ["email", "phoneNumber"];
  roles.forEach((role) => {
    duplicates.forEach((duplicate) => {
      it(`Should reject duplicate (${duplicate}) (${role.type})`, async () => {
        await test(
          getInput(duplicate),
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
describe("Testing create user", () => {
  const schema = CREATE_USER;
  describe("Positive", () => {
    roles.forEach((role) => {
      it(`Should an admin create ${role} user`, async () => {
        const user = createRandomUser(role);
        const additionalTests = [
          (response: Response) => {
            expect(response.body.data.createUser).toMatchObject({
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              address: user.address,
              role: user.role,
            });
          },
          (response: Response) => {
            expect(response.body.data.createUser._id).toBeDefined();
          },
        ];
        await test(
          user,
          adminCookie,
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
    const rolesLocal = [{ type: "ADMIN", getCookie: () => adminCookie }];
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
      rolesLocal,
    );
    testBusniess(
      (field: string, value: unknown) => ({
        ...user,
        [field]: value,
      }),
      schema,
      requiredUserFields,
      rolesLocal,
      commonInvalidUserValues,
      specificInvalidUserValues,
    );
    describe("Should reject duplicate email/phoneNumber", () => {
      roles.forEach((role) => {
        const newUser = createRandomUser(role);
        const getInput = (duplicate: "email" | "phoneNumber") => ({
          ...newUser,
          [duplicate]: adminUser[duplicate],
        });
        testDuplicates(getInput, schema, rolesLocal);
      });
    });
  });
});

describe("Testing delete user by id", () => {
  const schema = DELETE_USER_BY_ID;
  describe("Positive", () => {
    roles.forEach((role) => {
      it(`Should an admin delete ${role} user by id`, async () => {
        const user = createRandomUser(role);
        const _id = await createUserAndGetId(user, adminCookie);
        const additionalTests = [
          (response: Response) => {
            expect(response.body.data.deleteUserById).toBe(true);
          },
        ];
        await test(
          _id,
          adminCookie,
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
    const rolesLocal = [{ type: "ADMIN", getCookie: () => adminCookie }];

    testAuthenication(() => userId, schema);
    testAuthorization(() => userId, schema, invalidAuthorizationSecinaros);
    testSchema(
      (field: string, value: unknown) => value,
      schema,
      idField,
      rolesLocal,
    );
    testBusniess(
      (field: string, value: unknown) => value,
      schema,
      idField,
      rolesLocal,
      commonInvalidUserValues,
      idSpecificInvalidField,
    );
    testObjectNotFound(() => `QQ${userId.slice(2)}`, schema, rolesLocal);
  });
});

describe("Testing get user by id", () => {
  const schema = GET_USER_BY_ID;
  describe("Positive", () => {
    roles.forEach((role) => {
      it(`Should an admin get ${role} user by id`, async () => {
        const user = createRandomUser(role);
        const _id = await createUserAndGetId(user, adminCookie);
        const additionalTests = [
          (response: Response) => {
            expect(response.body.data.user).toMatchObject({
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              address: user.address,
              role: user.role,
            });
          },
          (response: Response) => {
            expect(response.body.data.user._id).toBeDefined();
          },
        ];
        await test(
          _id,
          adminCookie,
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
    const rolesLocal = [{ type: "ADMIN", getCookie: () => adminCookie }];
    testAuthenication(() => userId, schema);
    testAuthorization(() => userId, schema, invalidAuthorizationSecinaros);
    testSchema(
      (field: string, value: unknown) => value,
      schema,
      idField,
      rolesLocal,
    );
    testBusniess(
      (field: string, value: unknown) => value,
      schema,
      idField,
      rolesLocal,
      commonInvalidUserValues,
      idSpecificInvalidField,
    );
    testObjectNotFound(() => `QQ${userId.slice(2)}`, schema, rolesLocal);
  });
});
describe("Testing get all users", () => {
  const schema = GET_ALL_USERS;
  describe("Positive", () => {
    it(`Should an admin get all users`, async () => {
      const additionalTests = [
        (response: Response) => {
          expect(response.body.data.users.length).toBeGreaterThanOrEqual(1);
        },
        (response: Response) => {
          const users = response.body.data.users;
          for (let user of users) {
            expect(user.firstName).toBeDefined();
            expect(user.lastName).toBeDefined();
            expect(user.email).toBeDefined();
            expect(user.address).toBeDefined();
            expect(user.role).toBeDefined();
          }
        },
      ];
      await test(
        undefined,
        adminCookie,
        schema,
        200,
        "undefined",
        "defined",
        additionalTests,
      );
    });
  });

  describe("Negative", () => {
    testAuthenication(() => userId, schema);
    testAuthorization(() => userId, schema, invalidAuthorizationSecinaros);
  });
});

describe("Testing delete me", () => {
  const schema = DELETE_ME;

  describe("Positive", () => {
    roles.forEach((role) => {
      it(`Should ${role} deletes himslef`, async () => {
        const cookie = await createRandomUserAndLoginAndGetCookie(
          role,
          adminCookie,
        );
        const additionalTests = [
          (response: Response) => {
            expect(response.body.data.deleteMe).toBe(true);
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

describe("Testing get user by id", () => {
  const schema = GET_ME;
  describe("Positive", () => {
    roles.forEach((role) => {
      it(`Should ${role} get himslef`, async () => {
        const user = createRandomUser(role);
        const cookie = await createUserAndLoginAndGetCookie(user, adminCookie);
        const additionalTests = [
          (response: Response) => {
            expect(response.body.data.me).toMatchObject({
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              address: user.address,
              role: user.role,
            });
          },
          (response: Response) => {
            expect(response.body.data.me._id).toBeDefined();
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

describe("Testing update me", () => {
  const schema = UPDATE_ME;
  let adminCookieLocal: string,
    instructorCookieLocal: string,
    studentCookieLocal: string;
  beforeAll(async () => {
    adminCookieLocal = await createRandomUserAndLoginAndGetCookie(
      "ADMIN",
      adminCookie,
    );
    instructorCookieLocal = await createRandomUserAndLoginAndGetCookie(
      "INSTRUCTOR",
      adminCookie,
    );
    studentCookieLocal = await createRandomUserAndLoginAndGetCookie(
      "STUDENT",
      adminCookie,
    );
  });
  const rolesLocal = [
    {
      type: "ADMIN",
      getCookie: () => adminCookieLocal,
    },
    {
      type: "INSTRUCTOR",
      getCookie: () => instructorCookieLocal,
    },
    {
      type: "STUDENT",
      getCookie: () => studentCookieLocal,
    },
  ];
  describe("Positive", () => {
    const getInput = () => {
      const newUser = createRandomUser();
      return {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phoneNumber: newUser.phoneNumber,
        email: newUser.email,
        address: newUser.address,
      };
    };
    const getInputOneField = (field: (typeof updateUserFields)[number]) => {
      const newUser = createRandomUser();
      return {
        [field.name]: newUser[field.name],
      };
    };

    testUpdateManyFields(getInput, schema, "updateMe", rolesLocal);
    testUpdateOneField(
      getInputOneField,
      schema,
      "updateMe",
      rolesLocal,
      updateUserFields,
    );
  });
  describe("Negative", () => {
    const user = createRandomUser();
    const input = () => ({
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      address: user.address,
    });
    testAuthenication(input, schema);
    testSchema(
      (field: string, value: unknown) => ({
        ...input(),
        [field]: value,
      }),
      schema,
      updateUserFields,
      rolesLocal,
      true,
    );
    testBusniess(
      (field: string, value: unknown) => ({
        ...input(),
        [field]: value,
      }),
      schema,
      updateUserFields,
      rolesLocal,
      commonInvalidUserValues,
      specificInvalidUserValues,
    );
    describe("Should reject duplicate email/phoneNumber", () => {
      const getInput = (duplicate: "email" | "phoneNumber") => ({
        [duplicate]: adminUser[duplicate],
      });
      testDuplicates(getInput, schema, rolesLocal);
    });
  });
});

describe("Testing update user by id", () => {
  const schema = UPDATE_USER_BY_ID;
  describe("Positive", () => {
    let adminId: string, instructorId: string, studentId: string;
    beforeAll(async () => {
      adminId = await createRandomUserAndGetId("ADMIN", adminCookie);
      instructorId = await createRandomUserAndGetId("INSTRUCTOR", adminCookie);
      studentId = await createRandomUserAndGetId("STUDENT", adminCookie);
    });
    const roles = [
      {
        type: "ADMIN",
        getId: () => adminId,
      },
      {
        type: "INSTRUCTOR",
        getId: () => instructorId,
      },
      {
        type: "STUDENT",
        getId: () => studentId,
      },
    ];
    const additionalTests = [
      (response: Response) => {
        expect(response.body.data.updateUserById).toBe(true);
      },
    ];
    describe("Update many fields", () => {
      roles.forEach((role) => {
        it(`Should an admin update all ${role.type} user fields`, async () => {
          const newUser = createRandomUser();
          const input = {
            _id: role.getId(),
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            phoneNumber: newUser.phoneNumber,
            email: newUser.email,
            address: newUser.address,
          };

          await test(
            input,
            adminCookie,
            schema,
            200,
            "undefined",
            "defined",
            additionalTests,
          );
        });
      });
    });

    describe("Update one field", () => {
      roles.forEach((role) => {
        const newUser = createRandomUser();
        updateUserFields.forEach((field) => {
          it(`Should an admin update only one ${role.type} user field (${field.name})`, async () => {
            const input = {
              _id: role.getId(),
              [field.name]: newUser[field.name],
            };
            await test(
              input,
              adminCookie,
              schema,
              200,
              "undefined",
              "defined",
              additionalTests,
            );
          });
        });
      });
    });
  });
  describe("Negative", () => {
    const rolesLocal = [{ type: "ADMIN", getCookie: () => adminCookie }];
    const requiredFields = [...updateUserFields, { name: "_id" }];
    const specificInvalidValues = { ...specificInvalidUserValues, _id: [] };
    const user = createRandomUser();
    const input = () => ({
      _id: userId,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      address: user.address,
    });
    testAuthenication(input, schema);
    testAuthorization(input, schema, invalidAuthorizationSecinaros);
    testSchema(
      (field: string, value: unknown) => ({
        ...input(),
        [field]: value,
      }),
      schema,
      requiredFields,
      rolesLocal,
      true,
    );
    testBusniess(
      (field: string, value: unknown) => ({
        ...input(),
        [field]: value,
      }),
      schema,
      requiredFields,
      rolesLocal,
      commonInvalidUserValues,
      specificInvalidValues,
    );
    describe("Should reject duplicate email/phoneNumber", () => {
      const getInput = (duplicate: "email" | "phoneNumber") => ({
        _id: userId,
        [duplicate]: adminUser[duplicate],
      });
      testDuplicates(getInput, schema, rolesLocal);
    });
  });
});
