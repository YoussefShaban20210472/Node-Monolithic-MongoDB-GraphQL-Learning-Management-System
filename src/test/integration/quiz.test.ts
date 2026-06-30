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
} from "../graphql/fixture/user.fixture.graphql.js";

import { test, testCommon } from "./shared/common-test.shared.js";
import { Response } from "supertest";

import { createRandomCourse } from "../utils/factory/course.factory.js";

import {
  createCourseAndGetId,
  createRandomCourseAndGetId,
} from "../utils/helper/course.helper.js";
import {
  CREATE_QUIZ,
  DELETE_QUIZ_BY_ID,
  GET_ALL_QUIZZES,
  GET_QUIZ_BY_ID,
  UPDATE_QUIZ_BY_ID,
} from "../graphql/operation/quiz.operation.graphql.js";
import { createRandomQuiz } from "../utils/factory/quiz.factory.js";
import {
  requiredQuizFields,
  updateQuizFields,
} from "../graphql/fixture/quiz.fixture.graphql.js";
import {
  createQuizAndGetId,
  createRandomQuizAndGetId,
} from "../utils/helper/quiz.helper.js";
import { enrollStudentAndAccept } from "../utils/helper/enrollment.helper.js";
import { createRandomQuestionBanksAndGetIds } from "../utils/helper/questionBank.helper.js";

let adminCookie: string;
let instructorCookie: string;
let studentCookie: string;
let randomInstructorCookie: string;
let randomStudentCookie: string;
let instructorId: string;
let studentId: string;
let dumyId: string = "6a32819b438924494803bf97";
let course = createRandomCourse();
let quiz = createRandomQuiz([], "");
let courseId: string;
let quizId: string;
let questionBankIds: string[];
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
  questionBankIds = await createRandomQuestionBanksAndGetIds(
    courseId,
    adminCookie,
  );
  quiz = createRandomQuiz(questionBankIds, courseId);
  quizId = await createQuizAndGetId(quiz, adminCookie);
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
describe("Testing create quiz", () => {
  const schema = CREATE_QUIZ;
  describe("Positive", () => {
    roles.forEach((role) => {
      it(`Should ${role.type} creates a new quiz`, async () => {
        const quiz = createRandomQuiz(questionBankIds, courseId);
        const additionalTests = [
          (response: Response) => {
            expect(response.body.data.createQuiz).toMatchObject(quiz);
          },
          (response: Response) => {
            expect(response.body.data.createQuiz._id).toBeDefined();
          },
        ];
        await test(
          quiz,
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
      () => createRandomQuiz(questionBankIds, courseId),
      invalidAuthorizationSecinaros,
      requiredQuizFields,
      roles,
      ["courseId"],
      { duration: true },
      "Object",
    );
    describe("Should return Object Not found if a question id is not found", () => {
      roles.forEach((role) => {
        it(`Should return Object Not found if a question id is not found ${role.type}`, async () => {
          const quiz = createRandomQuiz([...questionBankIds, dumyId], courseId);
          await test(
            quiz,
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

describe("Testing delete quiz by id", () => {
  const schema = DELETE_QUIZ_BY_ID;
  describe("Positive", () => {
    let quizId: string;
    beforeEach(async () => {
      quizId = await createRandomQuizAndGetId(
        courseId,
        questionBankIds,
        adminCookie,
      );
    });

    roles.forEach((role) => {
      it(`Should ${role.type} deletes a quiz by id`, async () => {
        const additionalTests = [
          (response: Response) => {
            expect(response.body.data.deleteQuizById).toBe(true);
          },
        ];
        await test(
          { _id: quizId },
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
      () => ({ _id: quizId }),
      invalidAuthorizationSecinaros,
      idField,
      roles,
      ["_id"],
    );
  });
});

describe("Testing get all quizs", () => {
  const schema = GET_ALL_QUIZZES;
  const roles = [
    { type: "ADMIN", getCookie: () => adminCookie },
    { type: "INSTRUCTOR", getCookie: () => instructorCookie },
    { type: "STUDENT", getCookie: () => studentCookie },
  ];
  describe("Positive", () => {
    roles.forEach((role) => {
      it(`Should ${role.type} get all quizzes`, async () => {
        const additionalTests = [
          (response: Response) => {
            expect(response.body.data.quizzes.length).toBeGreaterThanOrEqual(1);
          },
          (response: Response) => {
            const objects = response.body.data.quizzes;
            for (let object of objects) {
              expect(object._id).toBeDefined();
              expect(object.courseId).toBeDefined();
              expect(object.title).toBeDefined();
              expect(object.description).toBeDefined();
              expect(object.startDate).toBeDefined();
              expect(object.endDate).toBeDefined();
              expect(object.questionIds).toBeDefined();
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
              expect(response.body.data.quizzes.length).toBe(0);
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

describe("Testing get quiz by id", () => {
  const schema = GET_QUIZ_BY_ID;
  describe("Positive", () => {
    roles.forEach((role) => {
      it(`Should ${role.type} gets quiz by id`, async () => {
        const additionalTests = [
          (response: Response) => {
            expect(response.body.data.quiz).toMatchObject(quiz);
          },
          (response: Response) => {
            expect(response.body.data.quiz._id).toBeDefined();
          },
        ];
        await test(
          { _id: quizId },
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
      () => ({ _id: quizId }),
      invalidAuthorizationSecinaros,
      idField,
      roles,
      ["_id"],
    );
  });
});

describe("Testing update quiz by id", () => {
  const schema = UPDATE_QUIZ_BY_ID;
  describe("Positive", () => {
    const additionalTests = [
      (response: Response) => {
        expect(response.body.data.updateQuizById).toBe(true);
      },
    ];
    describe("Update many fields", () => {
      let quizId: string;
      beforeEach(async () => {
        quizId = await createRandomQuizAndGetId(
          courseId,
          questionBankIds,
          adminCookie,
        );
      });
      roles.forEach((role) => {
        it(`Should ${role.type} updates all quiz fields`, async () => {
          const newquiz = createRandomQuiz(questionBankIds, courseId);
          delete newquiz.courseId;
          const input = {
            _id: quizId,
            ...newquiz,
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
      let quizId: string;
      beforeAll(async () => {
        quizId = await createRandomQuizAndGetId(
          courseId,
          questionBankIds,
          adminCookie,
        );
      });
      roles.forEach((role) => {
        const newquiz = createRandomQuiz(questionBankIds, courseId);
        delete newquiz.courseId;
        updateQuizFields.forEach((field) => {
          it(`Should ${role.type} updates only one quiz field (${field.name})`, async () => {
            newquiz.questionIds = questionBankIds;
            const input = {
              _id: quizId,
              [field.name]: newquiz[field.name],
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
      ...updateQuizFields,
      { name: "_id", domain: "ID" },
    ] as const;
    testCommon(
      schema,
      () => ({ _id: quizId }),
      invalidAuthorizationSecinaros,
      requiredFields,
      roles,
      ["_id"],
      { allowMissing: true, duration: true },
      "Object",
    );
    describe("Should return Object Not found if a question id is not found", () => {
      roles.forEach((role) => {
        it(`Should return Object Not found if a question id is not found ${role.type}`, async () => {
          await test(
            { _id: quizId, questionIds: [...questionBankIds, dumyId] },
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
