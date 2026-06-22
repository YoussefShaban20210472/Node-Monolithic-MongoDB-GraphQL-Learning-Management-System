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

import { createRandomCourse } from "../utils/factory/course.factory.js";

import { createCourseAndGetId } from "../utils/helper/course.helper.js";
import {
  CONFIRM_ENROLLMENT,
  DELETE_ENROLLMENT_BY_ADMIN,
  DELETE_ENROLLMENT_BY_STUDENT,
  ENROLL_STUDENT_BY_ADMIN,
  ENROLL_STUDENT_BY_STUDENT,
  GET_ENROLLMENT_BY_ADMIN,
  GET_ENROLLMENT_BY_STUDENT,
} from "../graphql/operation/enrollment.operation.graphql.js";
import {
  commonInvalidEnrollmentValues,
  specificInvalidEnrollmentValues,
} from "../graphql/fixture/enrollment-invalid.fixture.graphql.js";
import {
  confirmEnrollment,
  enrollStudent,
  enrollStudentById,
} from "../utils/helper/enrollment.helper.js";

let adminCookie: string;
let instructorCookie: string;
let studentCookie: string;
let randomInstructorCookie: string;
let instructorId: string;
let studentId: string;
let course = createRandomCourse();
let courseId: string;

beforeAll(async () => {
  adminCookie = await loginAndGetCookie(adminLogin);
  instructorCookie = await loginAndGetCookie(instructorLogin);
  studentCookie = await loginAndGetCookie(studentLogin);
  instructorId = await getUserId(instructorCookie);
  studentId = await getUserId(studentCookie);
  randomInstructorCookie = await createRandomUserAndLoginAndGetCookie(
    "INSTRUCTOR",
    adminCookie,
  );
  courseId = await createCourseAndGetId(course, instructorCookie);
});

function testCommon(
  schema: string,
  getInput: () => object,
  invalidAuthorizationSecinaros: {
    type: string;
    getCookie: () => string;
  }[],
  requiredFields: { name: string }[],
  roles: {
    type: string;
    getCookie: () => string;
  }[],
  objectsNotFound: string[],
) {
  testAuthenication(getInput, schema);
  testAuthorization(getInput, schema, invalidAuthorizationSecinaros);
  testSchema(
    (field: string, value: unknown) => ({
      ...getInput(),
      [field]: value,
    }),
    schema,
    requiredFields,
    roles,
  );
  testBusniess(
    (field: string, value: unknown) => ({
      ...getInput(),
      [field]: value,
    }),
    schema,
    requiredFields,
    roles,
    commonInvalidEnrollmentValues,
    specificInvalidEnrollmentValues,
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

describe("Testing enroll student by student", () => {
  const schema = ENROLL_STUDENT_BY_STUDENT;
  let studentCookie: string;
  let studentId: string;
  describe("Positive", () => {
    beforeAll(async () => {
      studentCookie = await createRandomUserAndLoginAndGetCookie(
        "STUDENT",
        adminCookie,
      );
      studentId = await getUserId(studentCookie);
    });
    it(`Should a student enroll to a course`, async () => {
      const additionalTests = [
        (response: Response) => {
          expect(response.body.data.enrollStudentByStudent).toMatchObject({
            courseId,
            studentId,
            status: "PENDING",
          });
        },
        (response: Response) => {
          expect(response.body.data.enrollStudentByStudent._id).toBeDefined();
        },
      ];
      await test(
        { courseId },
        studentCookie,
        schema,
        200,
        "undefined",
        "defined",
        additionalTests,
      );
    });
  });
  describe("Negative", () => {
    beforeAll(async () => {
      studentCookie = await createRandomUserAndLoginAndGetCookie(
        "STUDENT",
        adminCookie,
      );
    });
    const invalidAuthorizationSecinaros = [
      { type: "ADMIN", getCookie: () => adminCookie },
      { type: "INSTRUCTOR", getCookie: () => instructorCookie },
    ];
    const roles = [{ type: "STUDENT", getCookie: () => studentCookie }];
    const requiredFields = [{ name: "courseId" }];
    testCommon(
      schema,
      () => ({
        courseId,
      }),
      invalidAuthorizationSecinaros,
      requiredFields,
      roles,
      ["courseId"],
    );

    describe("Should return confilct if a student enrolls twice to the same course", () => {
      let studentCookie: string;
      beforeAll(async () => {
        studentCookie = await createRandomUserAndLoginAndGetCookie(
          "STUDENT",
          adminCookie,
        );
      });
      it(`Should return confilct if a student enrolls twice to the same course`, async () => {
        await test(
          { courseId },
          studentCookie,
          schema,
          200,
          "undefined",
          "defined",
          [],
        );
        await test(
          { courseId },
          studentCookie,
          schema,
          200,
          "defined",
          "null",
          [],
        );
      });
    });
  });
});

describe("Testing enroll student by admin", () => {
  const schema = ENROLL_STUDENT_BY_ADMIN;
  const roles = [{ type: "ADMIN", getCookie: () => adminCookie }];
  let studentId: string;
  describe("Positive", () => {
    beforeAll(async () => {
      studentId = await createRandomUserAndGetId("STUDENT", adminCookie);
    });
    it(`Should an admin enroll to a course`, async () => {
      const additionalTests = [
        (response: Response) => {
          console.log(response.body);
          expect(response.body.data.enrollStudentByAdmin).toMatchObject({
            courseId,
            studentId,
            status: "PENDING",
          });
        },
        (response: Response) => {
          expect(response.body.data.enrollStudentByAdmin._id).toBeDefined();
        },
      ];
      await test(
        { courseId, studentId },
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
    beforeAll(async () => {
      studentId = await createRandomUserAndGetId("STUDENT", adminCookie);
    });
    const invalidAuthorizationSecinaros = [
      { type: "STUDENT", getCookie: () => studentCookie },
      { type: "INSTRUCTOR", getCookie: () => instructorCookie },
    ];
    const requiredFields = [{ name: "courseId" }, { name: "studentId" }];
    testCommon(
      schema,
      () => ({
        courseId,
        studentId,
      }),
      invalidAuthorizationSecinaros,
      requiredFields,
      roles,
      ["courseId", "studentId"],
    );

    describe("Should return confilct if a student enrolls twice to the same course", () => {
      let studentId: string;
      beforeAll(async () => {
        studentId = await createRandomUserAndGetId("STUDENT", adminCookie);
      });
      it(`Should return confilct if a student enrolls twice to the same course`, async () => {
        await test(
          { courseId, studentId },
          adminCookie,
          schema,
          200,
          "undefined",
          "defined",
          [],
        );
        await test(
          { courseId, studentId },
          adminCookie,
          schema,
          200,
          "defined",
          "null",
          [],
        );
      });
    });
  });
});

describe("Testing get enrollment by student", () => {
  const schema = GET_ENROLLMENT_BY_STUDENT;
  let studentCookie: string;
  let studentId: string;
  describe("Positive", () => {
    beforeAll(async () => {
      studentCookie = await createRandomUserAndLoginAndGetCookie(
        "STUDENT",
        adminCookie,
      );
      await enrollStudent(studentCookie, courseId);
      studentId = await getUserId(studentCookie);
    });
    it(`Should a student gets their enrollment`, async () => {
      const additionalTests = [
        (response: Response) => {
          expect(response.body.data.getEnrollmentByStudent).toMatchObject({
            courseId,
            studentId,
            status: "PENDING",
          });
        },
      ];
      await test(
        { courseId },
        studentCookie,
        schema,
        200,
        "undefined",
        "defined",
        additionalTests,
      );
    });
  });
  describe("Negative", () => {
    let studentCookie: string;
    beforeAll(async () => {
      studentCookie = await createRandomUserAndLoginAndGetCookie(
        "STUDENT",
        adminCookie,
      );
      await enrollStudent(studentCookie, courseId);
    });
    const invalidAuthorizationSecinaros = [
      { type: "ADMIN", getCookie: () => adminCookie },
      { type: "INSTRUCTOR", getCookie: () => instructorCookie },
    ];
    const roles = [{ type: "STUDENT", getCookie: () => studentCookie }];
    const requiredFields = [{ name: "courseId" }];
    testCommon(
      schema,
      () => ({
        courseId,
      }),
      invalidAuthorizationSecinaros,
      requiredFields,
      roles,
      ["courseId"],
    );
  });
});

describe("Testing get enrollment by admin", () => {
  const schema = GET_ENROLLMENT_BY_ADMIN;
  const roles = [{ type: "ADMIN", getCookie: () => adminCookie }];
  let studentId: string;
  describe("Positive", () => {
    beforeAll(async () => {
      studentId = await createRandomUserAndGetId("STUDENT", adminCookie);
      await enrollStudentById(studentId, courseId, adminCookie);
    });
    it(`Should an admin gets a studnet enrollment`, async () => {
      const additionalTests = [
        (response: Response) => {
          expect(response.body.data.getEnrollmentByAdmin).toMatchObject({
            courseId,
            studentId,
            status: "PENDING",
          });
        },
      ];
      await test(
        { courseId, studentId },
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
    beforeAll(async () => {
      studentId = await createRandomUserAndGetId("STUDENT", adminCookie);
      await enrollStudentById(studentId, courseId, adminCookie);
    });
    const invalidAuthorizationSecinaros = [
      { type: "STUDENT", getCookie: () => studentCookie },
      { type: "INSTRUCTOR", getCookie: () => instructorCookie },
    ];
    const requiredFields = [{ name: "courseId" }, { name: "studentId" }];
    testCommon(
      schema,
      () => ({
        courseId,
        studentId,
      }),
      invalidAuthorizationSecinaros,
      requiredFields,
      roles,
      ["courseId", "studentId"],
    );
  });
});

describe("Testing unenroll student by student", () => {
  const schema = DELETE_ENROLLMENT_BY_STUDENT;
  let studentCookie: string;
  describe("Positive", () => {
    beforeAll(async () => {
      studentCookie = await createRandomUserAndLoginAndGetCookie(
        "STUDENT",
        adminCookie,
      );
      await enrollStudent(studentCookie, courseId);
    });
    it(`Should a student unenroll from a course`, async () => {
      const additionalTests = [
        (response: Response) => {
          expect(response.body.data.deleteEnrollmentByStudent).toBe(true);
        },
      ];
      await test(
        { courseId },
        studentCookie,
        schema,
        200,
        "undefined",
        "defined",
        additionalTests,
      );
    });
  });
  describe("Negative", () => {
    let studentCookie: string;
    beforeAll(async () => {
      studentCookie = await createRandomUserAndLoginAndGetCookie(
        "STUDENT",
        adminCookie,
      );
      await enrollStudent(studentCookie, courseId);
    });
    const invalidAuthorizationSecinaros = [
      { type: "ADMIN", getCookie: () => adminCookie },
      { type: "INSTRUCTOR", getCookie: () => instructorCookie },
    ];
    const roles = [{ type: "STUDENT", getCookie: () => studentCookie }];
    const requiredFields = [{ name: "courseId" }];
    testCommon(
      schema,
      () => ({
        courseId,
      }),
      invalidAuthorizationSecinaros,
      requiredFields,
      roles,
      ["courseId"],
    );

    describe("Should return confilct if a student unroll from a confirmed enrollment request", () => {
      let studentId: string;
      let studentCookie: string;
      beforeAll(async () => {
        studentCookie = await createRandomUserAndLoginAndGetCookie(
          "STUDENT",
          adminCookie,
        );
        studentId = await getUserId(studentCookie);
        await enrollStudent(studentCookie, courseId);
        await confirmEnrollment(studentId, courseId, adminCookie, "ACCEPTED");
      });
      it(`Should return confilct if a student unroll from a confirmed enrollment request`, async () => {
        await test(
          { courseId },
          studentCookie,
          schema,
          200,
          "defined",
          "null",
          [],
        );
      });
    });
  });
});

describe("Testing unenroll student by admin", () => {
  const schema = DELETE_ENROLLMENT_BY_ADMIN;
  const roles = [{ type: "ADMIN", getCookie: () => adminCookie }];
  let studentId: string;
  describe("Positive", () => {
    beforeAll(async () => {
      studentId = await createRandomUserAndGetId("STUDENT", adminCookie);
      await enrollStudentById(studentId, courseId, adminCookie);
    });
    it(`Should an admin unenroll from a course`, async () => {
      const additionalTests = [
        (response: Response) => {
          console.log(response.body);
          expect(response.body.data.deleteEnrollmentByAdmin).toBe(true);
        },
      ];
      await test(
        { courseId, studentId },
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
    beforeAll(async () => {
      studentId = await createRandomUserAndGetId("STUDENT", adminCookie);
      await enrollStudentById(studentId, courseId, adminCookie);
    });
    const invalidAuthorizationSecinaros = [
      { type: "STUDENT", getCookie: () => studentCookie },
      { type: "INSTRUCTOR", getCookie: () => instructorCookie },
    ];
    const requiredFields = [{ name: "courseId" }, { name: "studentId" }];
    testCommon(
      schema,
      () => ({
        courseId,
        studentId,
      }),
      invalidAuthorizationSecinaros,
      requiredFields,
      roles,
      ["courseId", "studentId"],
    );

    describe("Should return confilct if a student unroll from a confirmed enrollment request", () => {
      let studentId: string;
      let studentCookie: string;
      beforeEach(async () => {
        studentCookie = await createRandomUserAndLoginAndGetCookie(
          "STUDENT",
          adminCookie,
        );
        studentId = await getUserId(studentCookie);
        await enrollStudent(studentCookie, courseId);
        await confirmEnrollment(studentId, courseId, adminCookie, "ACCEPTED");
      });
      roles.forEach((role) => {
        it(`Should return confilct if a student unroll from a confirmed enrollment request (${role.type})`, async () => {
          await test(
            { courseId, studentId },
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
  });
});

describe("Testing confirm a student enrollment", () => {
  const schema = CONFIRM_ENROLLMENT;
  const roles = [
    { type: "ADMIN", getCookie: () => adminCookie },
    { type: "INSTRUCTOR", getCookie: () => instructorCookie },
  ];
  let studentId: string;
  describe("Positive", () => {
    beforeEach(async () => {
      studentId = await createRandomUserAndGetId("STUDENT", adminCookie);
      await enrollStudentById(studentId, courseId, adminCookie);
    });
    const statuses = ["ACCEPTED", "REJECTED"];
    roles.forEach((role) => {
      statuses.forEach((status) => {
        it(`Should an ${role.type} confirm a student enrollment (${status})`, async () => {
          const additionalTests = [
            (response: Response) => {
              expect(response.body.data.confirmEnrollment).toBe(true);
            },
          ];
          await test(
            { courseId, studentId, status },
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

  describe("Negative", () => {
    beforeAll(async () => {
      studentId = await createRandomUserAndGetId("STUDENT", adminCookie);
      await enrollStudentById(studentId, courseId, adminCookie);
    });
    const invalidAuthorizationSecinaros = [
      { type: "STUDENT", getCookie: () => studentCookie },
      {
        type: "Unauthorized INSTRUCTOR",
        getCookie: () => randomInstructorCookie,
      },
    ];
    const requiredFields = [
      { name: "courseId" },
      { name: "studentId" },
      { name: "status" },
    ];
    testCommon(
      schema,
      () => ({
        courseId,
        studentId,
        status: "ACCEPTED",
      }),
      invalidAuthorizationSecinaros,
      requiredFields,
      roles,
      ["courseId", "studentId"],
    );
  });
});
