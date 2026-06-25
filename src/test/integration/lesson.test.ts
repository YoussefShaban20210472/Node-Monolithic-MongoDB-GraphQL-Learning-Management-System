import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import {
  createRandomUserAndLoginAndGetCookie,
  getUserId,
  loginAndGetCookie,
} from "../utils/helper/user.helper.js";
import {
  adminLogin,
  instructorLogin,
  studentLogin,
  updateUserFields,
} from "../graphql/fixture/user.fixture.graphql.js";

import {
  testAuthenication,
  testAuthorization,
} from "./shared/auth-test.shared.js";
import { testBusniess } from "./shared/busniess-test.shared.js";
import { test, testCommon } from "./shared/common-test.shared.js";
import { Response } from "supertest";
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
  createCourseAndGetId,
  createRandomCourseAndGetId,
} from "../utils/helper/course.helper.js";
import {
  CREATE_LESSON,
  DELETE_LESSON_BY_ID,
  GET_ALL_LESSONS,
  GET_LESSON_BY_ID,
  GET_LESSON_OTP_BY_ID,
  UPDATE_LESSON_BY_ID,
} from "../graphql/operation/lesson.operation.graphql.js";
import { createRandomLesson } from "../utils/factory/lesson.factory.js";
import {
  requiredLessonFields,
  updateLessonFields,
} from "../graphql/fixture/lesson.fixture.graphql.js";
import { courseEndDate } from "../utils/date-builder.js";
import {
  createLessonAndGetId,
  createRandomLessonAndGetId,
} from "../utils/helper/lesson.helper.js";
import {
  enrollStudent,
  enrollStudentAndAccept,
} from "../utils/helper/enrollment.helper.js";

let adminCookie: string;
let instructorCookie: string;
let studentCookie: string;
let randomInstructorCookie: string;
let randomStudentCookie: string;
let instructorId: string;
let studentId: string;
let dumyId: string = "6a32819b438924494803bf97";
let course = createRandomCourse();
let lesson = createRandomLesson();
let courseId: string;
let lessonId: string;
const idField = [{ name: "_id", domain: "ID" }] as const;

beforeAll(async () => {
  adminCookie = await loginAndGetCookie(adminLogin);
  instructorCookie = await loginAndGetCookie(instructorLogin);
  studentCookie = await loginAndGetCookie(studentLogin);
  studentId = await getUserId(studentCookie);
  instructorId = await getUserId(instructorCookie);
  randomInstructorCookie = await createRandomUserAndLoginAndGetCookie(
    "INSTRUCTOR",
    adminCookie,
  );
  randomStudentCookie = await createRandomUserAndLoginAndGetCookie(
    "STUDENT",
    adminCookie,
  );
  courseId = await createCourseAndGetId(course, instructorCookie);
  await enrollStudentAndAccept(studentId, courseId, adminCookie);
  lesson = createRandomLesson(courseId);
  lessonId = await createLessonAndGetId(lesson, adminCookie);
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
describe("Testing create lesson", () => {
  const schema = CREATE_LESSON;
  describe("Positive", () => {
    roles.forEach((role) => {
      it(`Should ${role.type} creates a new lesson`, async () => {
        const lesson = createRandomLesson(courseId);
        const additionalTests = [
          (response: Response) => {
            expect(response.body.data.createLesson).toMatchObject(lesson);
          },
          (response: Response) => {
            expect(response.body.data.createLesson._id).toBeDefined();
          },
        ];
        await test(
          lesson,
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
    testCommon(
      schema,
      () => createRandomLesson(courseId),
      invalidAuthorizationSecinaros,
      requiredLessonFields,
      roles,
      [],
      { duration: true },
      "Object",
    );
  });
});

describe("Testing delete lesson by id", () => {
  const schema = DELETE_LESSON_BY_ID;
  describe("Positive", () => {
    let lessonId: string;
    beforeEach(async () => {
      lessonId = await createRandomLessonAndGetId(courseId, adminCookie);
    });

    roles.forEach((role) => {
      it(`Should ${role.type} deletes a lesson by id`, async () => {
        const additionalTests = [
          (response: Response) => {
            expect(response.body.data.deleteLessonById).toBe(true);
          },
        ];
        await test(
          { _id: lessonId },
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
    testCommon(
      schema,
      () => ({ _id: lessonId }),
      invalidAuthorizationSecinaros,
      idField,
      roles,
      ["_id"],
    );
  });
});

describe("Testing get all lessons", () => {
  const schema = GET_ALL_LESSONS;
  const roles = [
    { type: "ADMIN", getCookie: () => adminCookie },
    { type: "INSTRUCTOR", getCookie: () => instructorCookie },
    { type: "STUDENT", getCookie: () => studentCookie },
  ];
  describe("Positive", () => {
    roles.forEach((role) => {
      it(`Should ${role.type} get all lessons`, async () => {
        const additionalTests = [
          (response: Response) => {
            expect(response.body.data.lessons.length).toBeGreaterThanOrEqual(1);
          },
          (response: Response) => {
            const objects = response.body.data.lessons;
            for (let object of objects) {
              expect(object._id).toBeDefined();
              expect(object.courseId).toBeDefined();
              expect(object.title).toBeDefined();
              expect(object.description).toBeDefined();
              expect(object.startDate).toBeDefined();
              expect(object.endDate).toBeDefined();
              expect(object.otp).toBeUndefined();
              expect(object.instructorId).toBeUndefined();
            }
          },
        ];
        await test(
          { courseId },
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
      { type: "Unauthorized STUDENT", getCookie: () => randomStudentCookie },
      {
        type: "Unauthorized INSTRUCTOR",
        getCookie: () => randomInstructorCookie,
      },
    ];
    const requiredFields = [{ name: "courseId", domain: "ID" }] as const;
    testCommon(
      schema,
      () => ({ courseId }),
      invalidAuthorizationSecinaros,
      requiredFields,
      roles,
      ["courseId"],
    );
    describe("Should return [] for a new course", () => {
      let courseId: string;
      beforeAll(async () => {
        courseId = await createRandomCourseAndGetId(instructorCookie);
        await enrollStudentAndAccept(studentId, courseId, adminCookie);
      });
      roles.forEach((role) => {
        it(`Should ${role.type} gets [] for a new course`, async () => {
          const additionalTests = [
            (response: Response) => {
              expect(response.body.data.lessons.length).toBe(0);
            },
          ];
          await test(
            { courseId },
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

describe("Testing get lesson by id", () => {
  const schema = GET_LESSON_BY_ID;
  describe("Positive", () => {
    roles.forEach((role) => {
      it(`Should ${role.type} gets lesson by id`, async () => {
        const additionalTests = [
          (response: Response) => {
            expect(response.body.data.lesson).toMatchObject(lesson);
          },
          (response: Response) => {
            expect(response.body.data.lesson._id).toBeDefined();
          },
        ];
        await test(
          { _id: lessonId },
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
      { type: "Unauthorized STUDENT", getCookie: () => randomStudentCookie },
      {
        type: "Unauthorized INSTRUCTOR",
        getCookie: () => randomInstructorCookie,
      },
    ];
    testCommon(
      schema,
      () => ({ _id: lessonId }),
      invalidAuthorizationSecinaros,
      idField,
      roles,
      ["_id"],
    );
  });
});

describe("Testing get lesson otp by id", () => {
  const schema = GET_LESSON_OTP_BY_ID;
  describe("Positive", () => {
    roles.forEach((role) => {
      it(`Should ${role.type} gets lesson otp by id`, async () => {
        const additionalTests = [
          (response: Response) => {
            expect(response.body.data.lessonOTP).toBeDefined();
          },
        ];
        await test(
          { _id: lessonId },
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
      { type: "Unauthorized STUDENT", getCookie: () => randomStudentCookie },
      {
        type: "Unauthorized INSTRUCTOR",
        getCookie: () => randomInstructorCookie,
      },
    ];
    testCommon(
      schema,
      () => ({ _id: lessonId }),
      invalidAuthorizationSecinaros,
      idField,
      roles,
      ["_id"],
    );
  });
});

describe("Testing update lesson by id", () => {
  const schema = UPDATE_LESSON_BY_ID;
  describe("Positive", () => {
    const additionalTests = [
      (response: Response) => {
        expect(response.body.data.updateLessonById).toBe(true);
      },
    ];
    describe("Update many fields", () => {
      let lessonId: string;
      beforeEach(async () => {
        lessonId = await createRandomLessonAndGetId(courseId, adminCookie);
      });
      roles.forEach((role) => {
        it(`Should ${role.type} updates all lessons fields`, async () => {
          const newlesson = createRandomLesson();
          delete newlesson.courseId;
          const input = {
            _id: lessonId,
            ...newlesson,
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
      let lessonId: string;
      beforeAll(async () => {
        lessonId = await createRandomLessonAndGetId(courseId, adminCookie);
      });
      roles.forEach((role) => {
        const newlesson = createRandomLesson();
        delete newlesson.courseId;
        updateLessonFields.forEach((field) => {
          it(`Should ${role.type} updates only one course field (${field.name})`, async () => {
            const input = {
              _id: lessonId,
              [field.name]: newlesson[field.name],
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
    const requiredFields = [
      ...updateLessonFields,
      { name: "_id", domain: "ID" },
    ] as const;
    testCommon(
      schema,
      () => ({ _id: lessonId }),
      invalidAuthorizationSecinaros,
      requiredFields,
      roles,
      ["_id"],
      { allowMissing: true, duration: true },
      "Object",
    );
  });
});
