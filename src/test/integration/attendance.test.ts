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

import { test, testCommon } from "./shared/common-test.shared.js";
import { Response } from "supertest";

import { createRandomCourse } from "../utils/factory/course.factory.js";

import {
  createCourseAndGetId,
  createRandomCourseAndGetId,
} from "../utils/helper/course.helper.js";
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
  confirmEnrollment,
  enrollStudent,
  enrollStudentAndAccept,
  enrollStudentById,
} from "../utils/helper/enrollment.helper.js";
import {
  createLessonAndGetId,
  createRandomLessonAndGetId,
  getLessonOTPById,
} from "../utils/helper/lesson.helper.js";
import {
  ATTEND_STUDENT_BY_ADMIN,
  ATTEND_STUDENT_BY_STUDENT,
  GET_ALL_LESSON_ATTENDANCES,
  GET_ATTENDANCE,
  GET_ATTENDANCE_BY_STUDENT,
} from "../graphql/operation/attendance.operation.graphql.js";
import {
  requiredAttendanceByAdminFields,
  requiredAttendanceByStudentFields,
  requiredGetAttendanceByStudentFields,
  requiredGetAttendanceFields,
} from "../graphql/fixture/attendance.fixture.graphql.js";
import { attendStudent } from "../utils/helper/attendance.helper.js";

let adminCookie: string;
let instructorCookie: string;
let studentCookie: string;
let randomInstructorCookie: string;
let randomStudentCookie: string;
let instructorId: string;
let studentId: string;
let courseId: string;
let lessonId: string;
let otp: string;
let wrongOtp: string = "000000000000000000000";

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
  randomStudentCookie = await createRandomUserAndLoginAndGetCookie(
    "STUDENT",
    adminCookie,
  );
  courseId = await createRandomCourseAndGetId(instructorCookie);
  lessonId = await createRandomLessonAndGetId(courseId, adminCookie);
  otp = await getLessonOTPById(lessonId, adminCookie);
});

describe("Testing attend student by student", () => {
  const schema = ATTEND_STUDENT_BY_STUDENT;

  describe("Positive", () => {
    let studentCookie: string;
    let studentId: string;
    beforeAll(async () => {
      studentCookie = await createRandomUserAndLoginAndGetCookie(
        "STUDENT",
        adminCookie,
      );
      studentId = await getUserId(studentCookie);
      await enrollStudentAndAccept(studentId, courseId, adminCookie);
    });
    it(`Should a student attends a lesson`, async () => {
      const additionalTests = [
        (response: Response) => {
          expect(response.body.data.attendStudentByStudent).toMatchObject({
            lessonId,
            studentId,
          });
        },
        (response: Response) => {
          expect(response.body.data.attendStudentByStudent._id).toBeDefined();
        },
      ];
      await test(
        { lessonId, otp },
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
    let studentId: string;
    beforeAll(async () => {
      studentCookie = await createRandomUserAndLoginAndGetCookie(
        "STUDENT",
        adminCookie,
      );
      studentId = await getUserId(studentCookie);
      await enrollStudentAndAccept(studentId, courseId, adminCookie);
    });
    const invalidAuthorizationSecinaros = [
      { type: "ADMIN", getCookie: () => adminCookie },
      { type: "INSTRUCTOR", getCookie: () => instructorCookie },
      { type: "Unauthorized STUDENT", getCookie: () => randomStudentCookie },
    ];
    const roles = [{ type: "STUDENT", getCookie: () => studentCookie }];
    testCommon(
      schema,
      () => ({
        lessonId,
        otp,
      }),
      invalidAuthorizationSecinaros,
      requiredAttendanceByStudentFields,
      roles,
      ["lessonId"],
    );

    describe("Should return confilct if a student attends twice to the same lesson", () => {
      let studentCookie: string;
      let studentId: string;
      beforeAll(async () => {
        studentCookie = await createRandomUserAndLoginAndGetCookie(
          "STUDENT",
          adminCookie,
        );
        studentId = await getUserId(studentCookie);
        await enrollStudentAndAccept(studentId, courseId, adminCookie);
      });
      it(`Should return confilct if a student attends twice to the same lesson`, async () => {
        await test(
          { lessonId, otp },
          studentCookie,
          schema,
          200,
          "undefined",
          "defined",
          [],
        );
        await test(
          { lessonId, otp },
          studentCookie,
          schema,
          200,
          "defined",
          "null",
          [],
        );
      });
    });
    describe("Should return bad request if a student attends a lesson with wrong otp", () => {
      it(`Should return bad request if a student attends a lesson with wrong otp`, async () => {
        await test(
          { lessonId, otp: wrongOtp },
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

describe("Testing attend student by admin", () => {
  const schema = ATTEND_STUDENT_BY_ADMIN;
  const roles = [{ type: "ADMIN", getCookie: () => adminCookie }];
  describe("Positive", () => {
    let studentCookie: string;
    let studentId: string;
    beforeAll(async () => {
      studentCookie = await createRandomUserAndLoginAndGetCookie(
        "STUDENT",
        adminCookie,
      );
      studentId = await getUserId(studentCookie);
      await enrollStudentAndAccept(studentId, courseId, adminCookie);
    });
    it(`Should an admin attends a student to a lesson`, async () => {
      const additionalTests = [
        (response: Response) => {
          console.log(response.body);
          expect(response.body.data.attendStudentByAdmin).toMatchObject({
            lessonId,
            studentId,
          });
        },
        (response: Response) => {
          expect(response.body.data.attendStudentByAdmin._id).toBeDefined();
        },
      ];
      await test(
        { lessonId, studentId, otp },
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
    let studentCookie: string;
    let studentId: string;
    beforeAll(async () => {
      studentCookie = await createRandomUserAndLoginAndGetCookie(
        "STUDENT",
        adminCookie,
      );
      studentId = await getUserId(studentCookie);
      await enrollStudentAndAccept(studentId, courseId, adminCookie);
    });
    const invalidAuthorizationSecinaros = [
      { type: "STUDENT", getCookie: () => studentCookie },
      { type: "INSTRUCTOR", getCookie: () => instructorCookie },
    ];
    testCommon(
      schema,
      () => ({
        lessonId,
        studentId,
        otp,
      }),
      invalidAuthorizationSecinaros,
      requiredAttendanceByAdminFields,
      roles,
      ["lessonId", "studentId"],
    );

    describe("Should return confilct if a student attends twice to the same lesson", () => {
      let studentCookie: string;
      let studentId: string;
      beforeAll(async () => {
        studentCookie = await createRandomUserAndLoginAndGetCookie(
          "STUDENT",
          adminCookie,
        );
        studentId = await getUserId(studentCookie);
        await enrollStudentAndAccept(studentId, courseId, adminCookie);
      });
      it(`Should return confilct if a student attends twice to the same lesson`, async () => {
        await test(
          { studentId, lessonId, otp },
          adminCookie,
          schema,
          200,
          "undefined",
          "defined",
          [],
        );
        await test(
          { studentId, lessonId, otp },
          adminCookie,
          schema,
          200,
          "defined",
          "null",
          [],
        );
      });
    });
    describe("Should return bad request if a student attends a lesson with wrong otp", () => {
      it(`Should return bad request if a student attends a lesson with wrong otp`, async () => {
        await test(
          { studentId, lessonId, otp: wrongOtp },
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
describe("Testing get an attendance by student", () => {
  const schema = GET_ATTENDANCE_BY_STUDENT;

  describe("Positive", () => {
    let studentCookie: string;
    let studentId: string;
    beforeAll(async () => {
      studentCookie = await createRandomUserAndLoginAndGetCookie(
        "STUDENT",
        adminCookie,
      );
      studentId = await getUserId(studentCookie);
      await enrollStudentAndAccept(studentId, courseId, adminCookie);
      await attendStudent(studentId, lessonId, otp, adminCookie);
    });
    it(`Should a student gets his lesson attendance`, async () => {
      const additionalTests = [
        (response: Response) => {
          expect(response.body.data.attendanceByStudent).toMatchObject({
            lessonId,
            studentId,
          });
        },
        (response: Response) => {
          expect(response.body.data.attendanceByStudent._id).toBeDefined();
        },
      ];
      await test(
        { lessonId },
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
    let studentId: string;
    beforeAll(async () => {
      studentCookie = await createRandomUserAndLoginAndGetCookie(
        "STUDENT",
        adminCookie,
      );
      studentId = await getUserId(studentCookie);
      await enrollStudentAndAccept(studentId, courseId, adminCookie);
      await attendStudent(studentId, lessonId, otp, adminCookie);
    });
    const invalidAuthorizationSecinaros = [
      { type: "ADMIN", getCookie: () => adminCookie },
      { type: "INSTRUCTOR", getCookie: () => instructorCookie },
      { type: "Unauthorized STUDENT", getCookie: () => randomStudentCookie },
    ];
    const roles = [{ type: "STUDENT", getCookie: () => studentCookie }];
    testCommon(
      schema,
      () => ({
        lessonId,
      }),
      invalidAuthorizationSecinaros,
      requiredGetAttendanceByStudentFields,
      roles,
      ["lessonId"],
    );

    describe("Should return attendance not found if a student didn't attend the lesson", () => {
      let studentCookie: string;
      let studentId: string;
      beforeAll(async () => {
        studentCookie = await createRandomUserAndLoginAndGetCookie(
          "STUDENT",
          adminCookie,
        );
        studentId = await getUserId(studentCookie);
        await enrollStudentAndAccept(studentId, courseId, adminCookie);
      });
      it(`Should return attendance not found if a student didn't attend the lesson`, async () => {
        await test(
          { lessonId },
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

describe("Testing get an attendance by instructor and admin", () => {
  const schema = GET_ATTENDANCE;
  const roles = [
    { type: "ADMIN", getCookie: () => adminCookie },
    { type: "INSTRUCTOR", getCookie: () => instructorCookie },
  ];
  describe("Positive", () => {
    let studentCookie: string;
    let studentId: string;
    beforeAll(async () => {
      studentCookie = await createRandomUserAndLoginAndGetCookie(
        "STUDENT",
        adminCookie,
      );
      studentId = await getUserId(studentCookie);
      await enrollStudentAndAccept(studentId, courseId, adminCookie);
      await attendStudent(studentId, lessonId, otp, adminCookie);
    });
    roles.forEach((role) => {
      it(`Should an ${role.type} gets a lesson attendance`, async () => {
        const additionalTests = [
          (response: Response) => {
            console.log(response.body);
            expect(response.body.data.attendance).toMatchObject({
              lessonId,
              studentId,
            });
          },
          (response: Response) => {
            expect(response.body.data.attendance._id).toBeDefined();
          },
        ];
        await test(
          { lessonId, studentId },
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
    let studentCookie: string;
    let studentId: string;
    beforeAll(async () => {
      studentCookie = await createRandomUserAndLoginAndGetCookie(
        "STUDENT",
        adminCookie,
      );
      studentId = await getUserId(studentCookie);
      await enrollStudentAndAccept(studentId, courseId, adminCookie);
      await attendStudent(studentId, lessonId, otp, adminCookie);
    });
    const invalidAuthorizationSecinaros = [
      { type: "STUDENT", getCookie: () => studentCookie },
      {
        type: "Unauthorized INSTRUCTOR",
        getCookie: () => randomInstructorCookie,
      },
    ];
    testCommon(
      schema,
      () => ({
        lessonId,
        studentId,
      }),
      invalidAuthorizationSecinaros,
      requiredGetAttendanceFields,
      roles,
      ["lessonId", "studentId"],
    );
    describe("Should return attendance not found if a student didn't attend the lesson", () => {
      let studentCookie: string;
      let studentId: string;
      beforeAll(async () => {
        studentCookie = await createRandomUserAndLoginAndGetCookie(
          "STUDENT",
          adminCookie,
        );
        studentId = await getUserId(studentCookie);
        await enrollStudentAndAccept(studentId, courseId, adminCookie);
      });
      roles.forEach((role) => {
        it(`Should return attendance not found if a student didn't attend the lesson (${role.type})`, async () => {
          await test(
            { lessonId, studentId },
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

describe("Testing get all lesson attendances", () => {
  const schema = GET_ALL_LESSON_ATTENDANCES;
  const roles = [
    { type: "ADMIN", getCookie: () => adminCookie },
    { type: "INSTRUCTOR", getCookie: () => instructorCookie },
  ];
  let studentCookie: string;
  let studentId: string;
  beforeAll(async () => {
    studentCookie = await createRandomUserAndLoginAndGetCookie(
      "STUDENT",
      adminCookie,
    );
    studentId = await getUserId(studentCookie);
    await enrollStudentAndAccept(studentId, courseId, adminCookie);
    await attendStudent(studentId, lessonId, otp, adminCookie);
  });
  describe("Positive", () => {
    roles.forEach((role) => {
      it(`Should ${role.type} get all lesson attendances`, async () => {
        const additionalTests = [
          (response: Response) => {
            expect(
              response.body.data.lessonAttendances.length,
            ).toBeGreaterThanOrEqual(1);
          },
          (response: Response) => {
            const objects = response.body.data.lessonAttendances;
            for (let object of objects) {
              expect(object._id).toBeDefined();
              expect(object.lessonId).toBeDefined();
              expect(object.studentId).toBeDefined();
            }
          },
        ];
        await test(
          { lessonId },
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
    const invalidAuthorizationSecinaros = [
      { type: "STUDENT", getCookie: () => studentCookie },
      {
        type: "Unauthorized INSTRUCTOR",
        getCookie: () => randomInstructorCookie,
      },
    ];
    testCommon(
      schema,
      () => ({ lessonId }),
      invalidAuthorizationSecinaros,
      requiredGetAttendanceByStudentFields,
      roles,
      ["lessonId"],
    );
    describe("Should return [] for a new lesson", () => {
      let lessonId: string;
      beforeAll(async () => {
        lessonId = await createRandomLessonAndGetId(courseId, adminCookie);
      });
      roles.forEach((role) => {
        it(`Should ${role.type} gets [] for a new lesson`, async () => {
          const additionalTests = [
            (response: Response) => {
              expect(response.body.data.lessonAttendances.length).toBe(0);
            },
          ];
          await test(
            { lessonId },
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
