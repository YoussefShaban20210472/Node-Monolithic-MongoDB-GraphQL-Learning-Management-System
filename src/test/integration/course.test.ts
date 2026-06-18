import { describe, it, expect, beforeAll, beforeEach } from "vitest";
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
  DELETE_COURSE_BY_ID,
  GET_ALL_COURSES,
  GET_COURSE_BY_ID,
  UPDATE_COURSE_BY_ID,
} from "../graphql/operation/course.operation.graphql.js";
import { createRandomCourse } from "../utils/factory/course.factory.js";
import { requiredCourseFields } from "../graphql/fixture/course.fixture.graphql.js";
import {
  commonInvalidCourseValues,
  specificInvalidCourseValues,
} from "../graphql/fixture/course-invalid.fixture.graphql.js";
import { invalidCourseDuriationFields } from "../utils/date-builder.js";
import {
  createCourseAndGetId,
  createRandomCourseAndGetId,
} from "../utils/helper/course.helper.js";

let adminCookie: string;
let instructorCookie: string;
let studentCookie: string;
let randomInstructorCookie: string;
let instructorId: string;
let dumyId: string = "6a32819b438924494803bf97";
let course = createRandomCourse();
let courseId: string;
const idField = [{ name: "_id" }] as const;
const idSpecificInvalidField = { _id: [] };

beforeAll(async () => {
  adminCookie = await loginAndGetCookie(adminLogin);
  instructorCookie = await loginAndGetCookie(instructorLogin);
  studentCookie = await loginAndGetCookie(studentLogin);
  instructorId = await getUserId(instructorCookie);
  randomInstructorCookie = await createRandomUserAndLoginAndGetCookie(
    "INSTRUCTOR",
    adminCookie,
  );
  courseId = await createCourseAndGetId(course, instructorCookie);
});
const roles = [
  { type: "ADMIN", getCookie: () => adminCookie },
  { type: "INSTRUCTOR", getCookie: () => instructorCookie },
];
const invalidAuthorizationSecinaros = [
  { type: "STUDENT", getCookie: () => studentCookie },
  {
    type: "Unauthorized INSTRUCTOR",
    getCookie: () => randomInstructorCookie,
  },
];
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
      requiredCourseFields,
      roles,
      commonInvalidCourseValues,
      specificInvalidCourseValues,
    );
    testBusniess(
      (field: string, value: unknown) => ({
        ...course,
        [field]: value,
      }),
      schema,
      [{ name: "startDate" }, { name: "endDate" }],
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
    const requiredFields = [...requiredCourseFields, { name: "instructorId" }];
    const specificInvalidValues = {
      ...specificInvalidCourseValues,
      instructorId: [],
    };
    testAuthenication(() => course, schema);
    testAuthorization(() => course, schema, invalidAuthorizationSecinaros);
    testSchema(
      (field: string, value: unknown) => ({
        ...course,
        [field]: value,
      }),
      schema,
      requiredFields,
      rolesLocal,
    );
    testBusniess(
      (field: string, value: unknown) => ({
        ...course,
        [field]: value,
      }),
      schema,
      requiredFields,
      roles,
      commonInvalidCourseValues,
      specificInvalidValues,
    );
    testBusniess(
      (field: string, value: unknown) => ({
        ...course,
        [field]: value,
      }),
      schema,
      [{ name: "startDate" }, { name: "endDate" }],
      rolesLocal,
      [],
      invalidCourseDuriationFields,
    );
  });
});

describe("Testing delete course by id", () => {
  const schema = DELETE_COURSE_BY_ID;
  describe("Positive", () => {
    let courseId: string;
    beforeEach(async () => {
      courseId = await createRandomCourseAndGetId(instructorCookie);
    });

    roles.forEach((role) => {
      it(`Should ${role.type} deletes a course by id`, async () => {
        const additionalTests = [
          (response: Response) => {
            expect(response.body.data.deleteCourseById).toBe(true);
          },
        ];
        await test(
          courseId,
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
    testAuthenication(() => courseId, schema);
    testAuthorization(() => courseId, schema, invalidAuthorizationSecinaros);
    testSchema(
      (field: string, value: unknown) => value,
      schema,
      idField,
      roles,
    );
    testBusniess(
      (field: string, value: unknown) => value,
      schema,
      idField,
      roles,
      commonInvalidUserValues,
      idSpecificInvalidField,
    );
    testObjectNotFound(() => `QQ${courseId.slice(2)}`, schema, roles);
  });
});

describe("Testing get course by id", () => {
  const schema = GET_COURSE_BY_ID;
  describe("Positive", () => {
    roles.forEach((role) => {
      it(`Should ${role.type} gets course by id`, async () => {
        const additionalTests = [
          (response: Response) => {
            expect(response.body.data.course).toMatchObject({
              ...course,
              instructorId,
            });
          },
          (response: Response) => {
            expect(response.body.data.course._id).toBeDefined();
          },
        ];
        await test(
          courseId,
          role.getCookie(),
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
    const rolesLocal = [
      ...roles,
      { type: "STUDENT", getCookie: () => studentCookie },
    ];
    testAuthenication(() => courseId, schema);
    testAuthorization(() => courseId, schema, [
      invalidAuthorizationSecinaros[1],
    ]);
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
    testObjectNotFound(() => `QQ${courseId.slice(2)}`, schema, rolesLocal);
  });
});

describe("Testing get all courses", () => {
  const schema = GET_ALL_COURSES;
  const roles = [
    { type: "ADMIN", getCookie: () => adminCookie },
    { type: "INSTRUCTOR", getCookie: () => instructorCookie },
    { type: "STUDENT", getCookie: () => studentCookie },
  ];
  describe("Positive", () => {
    roles.forEach((role) => {
      it(`Should ${role.type} get all courses`, async () => {
        const additionalTests = [
          (response: Response) => {
            expect(response.body.data.courses.length).toBeGreaterThanOrEqual(1);
          },
          (response: Response) => {
            const courses = response.body.data.courses;
            for (let course of courses) {
              expect(course._id).toBeDefined();
              expect(course.title).toBeDefined();
              expect(course.description).toBeDefined();
              expect(course.shortDescription).toBeDefined();
              expect(course.instructorId).toBeDefined();
              expect(course.startDate).toBeDefined();
              expect(course.endDate).toBeDefined();
              expect(course.tags).toBeDefined();
              expect(course.categories).toBeDefined();
            }
          },
        ];
        await test(
          undefined,
          role.getCookie(),
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
    describe("Should return [] for new instructors", () => {
      let instructorCookie: string;
      beforeAll(async () => {
        instructorCookie = await createRandomUserAndLoginAndGetCookie(
          "INSTRUCTOR",
          adminCookie,
        );
      });
      it(`Should a new instructor get []`, async () => {
        const additionalTests = [
          (response: Response) => {
            expect(response.body.data.courses.length).toBe(0);
          },
        ];
        await test(
          undefined,
          instructorCookie,
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

describe("Testing update user by id", () => {
  const schema = UPDATE_COURSE_BY_ID;
  describe("Positive", () => {
    const additionalTests = [
      (response: Response) => {
        expect(response.body.data.updateCourseById).toBe(true);
      },
    ];
    describe("Update many fields", () => {
      let courseId: string;
      beforeEach(async () => {
        courseId = await createRandomCourseAndGetId(instructorCookie);
      });
      roles.forEach((role) => {
        it(`Should ${role.type} updates all course fields`, async () => {
          const newcourse = createRandomCourse();
          const input = {
            _id: courseId,
            ...newcourse,
          };

          await test(
            input,
            role.getCookie(),
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
      let courseId: string;
      beforeAll(async () => {
        courseId = await createRandomCourseAndGetId(instructorCookie);
      });
      roles.forEach((role) => {
        const newCourse = createRandomCourse();
        requiredCourseFields.forEach((field) => {
          it(`Should ${role.type} updates only one course field (${field.name})`, async () => {
            const input = {
              _id: courseId,
              [field.name]: newCourse[field.name],
            };
            await test(
              input,
              role.getCookie(),
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
    const input = () => ({
      _id: courseId,
    });
    const requiredFields = [...requiredCourseFields, { name: "_id" }];
    const specificInvalidValues = { ...specificInvalidCourseValues, _id: [] };
    testAuthenication(input, schema);
    testAuthorization(input, schema, invalidAuthorizationSecinaros);
    testSchema(
      (field: string, value: unknown) => ({
        ...input(),
        [field]: value,
      }),
      schema,
      requiredFields,
      roles,
      true,
    );
    testBusniess(
      (field: string, value: unknown) => ({
        ...input(),
        [field]: value,
      }),
      schema,
      requiredFields,
      roles,
      commonInvalidCourseValues,
      specificInvalidValues,
    );
    testBusniess(
      (field: string, value: unknown) => ({
        ...input(),
        [field]: value,
      }),
      schema,
      [{ name: "startDate" }, { name: "endDate" }],
      roles,
      [],
      invalidCourseDuriationFields,
    );
  });
});
