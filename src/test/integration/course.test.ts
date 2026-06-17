import { describe, it, expect, beforeAll } from "vitest";
import {
  createRandomUserAndGetId,
  createRandomUserAndLoginAndGetCookie,
  createUserAndGetId,
  createUserAndLoginAndGetCookie,
  getUserId,
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
import {
  CREATE_COURSE_BY_ADMIN,
  CREATE_COURSE_BY_INSTRUCTOR,
} from "../graphql/operation/course.operation.graphql.js";
import { createRandomCourse } from "../utils/factory/course.factory.js";
import { requiredCourseFields } from "../graphql/fixture/course.fixture.graphql.js";
import {
  commonInvalidCourseValues,
  specificInvalidCourseValues,
} from "../graphql/fixture/course-invalid.fixture.graphql.js";
import { invalidCourseDuriationFields } from "../utils/date-builder.js";

let adminCookie: string;
let instructorCookie: string;
let studentCookie: string;
let instructorId: string;
let dumyId: string = "6a32819b438924494803bf97";

beforeAll(async () => {
  adminCookie = await loginAndGetCookie(adminLogin);
  instructorCookie = await loginAndGetCookie(instructorLogin);
  studentCookie = await loginAndGetCookie(studentLogin);
  instructorId = await getUserId(instructorCookie);
});

describe("Testing create course by instructor", () => {
  const schema = CREATE_COURSE_BY_INSTRUCTOR;
  describe("Positive", () => {
    it(`Should an instructor create a new course`, async () => {
      const course = createRandomCourse();
      const additionalTests = [
        (response: Response) => {
          console.log(response.body);
          expect(response.body.data.createCourseByInstructor).toMatchObject({
            ...course,
            instructorId,
          });
        },
        (response: Response) => {
          expect(response.body.data.createCourseByInstructor._id).toBeDefined();
        },
      ];
      await test(
        course,
        instructorCookie,
        schema,
        200,
        "undefined",
        "defined",
        additionalTests,
      );
    });
  });

  describe("Negative", () => {
    const invalidAuthorizationSecinaros = [
      { type: "ADMIN", getCookie: () => adminCookie },
      { type: "STUDENT", getCookie: () => studentCookie },
    ];
    const rolesLocal = [
      { type: "INSTRUCTOR", getCookie: () => instructorCookie },
    ];
    const course = createRandomCourse();
    console.log(course);
    testAuthenication(() => course, schema);
    testAuthorization(() => course, schema, invalidAuthorizationSecinaros);
    testSchema(
      (field: string, value: unknown) => ({
        ...course,
        [field]: value,
      }),
      schema,
      requiredCourseFields,
      rolesLocal,
    );
    testBusniess(
      (field: string, value: unknown) => ({
        ...course,
        [field]: value,
      }),
      schema,
      ["startDate", "endDate"],
      rolesLocal,
      [],
      invalidCourseDuriationFields,
    );
  });
});

describe("Testing create course by admin", () => {
  const schema = CREATE_COURSE_BY_ADMIN;
  describe("Positive", () => {
    it(`Should an admin create a new course`, async () => {
      const course = { ...createRandomCourse(), instructorId };
      const additionalTests = [
        (response: Response) => {
          expect(response.body.data.createCourseByAdmin).toMatchObject(course);
        },
        (response: Response) => {
          expect(response.body.data.createCourseByAdmin._id).toBeDefined();
        },
      ];
      await test(
        course,
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
    const invalidAuthorizationSecinaros = [
      { type: "INSTRUCTOR", getCookie: () => instructorCookie },
      { type: "STUDENT", getCookie: () => studentCookie },
    ];
    const rolesLocal = [{ type: "ADMIN", getCookie: () => adminCookie }];
    const course = { ...createRandomCourse(), instructorId: dumyId };
    testAuthenication(() => course, schema);
    testAuthorization(() => course, schema, invalidAuthorizationSecinaros);
    testSchema(
      (field: string, value: unknown) => ({
        ...course,
        [field]: value,
      }),
      schema,
      requiredCourseFields,
      rolesLocal,
    );
    testBusniess(
      (field: string, value: unknown) => ({
        ...course,
        [field]: value,
      }),
      schema,
      ["startDate", "endDate"],
      rolesLocal,
      [],
      invalidCourseDuriationFields,
    );
  });
});
