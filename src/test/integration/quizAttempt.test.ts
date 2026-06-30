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

import { enrollStudentAndAccept } from "../utils/helper/enrollment.helper.js";
import {
  createRandomQuestionBanksAndGetIds,
  createRandomQuestionBanksAndGetIdsAndGetAnswers,
} from "../utils/helper/questionBank.helper.js";
import { createRandomQuiz } from "../utils/factory/quiz.factory.js";
import { createQuizAndGetId } from "../utils/helper/quiz.helper.js";
import {
  CREATE_QUIZ_ATTEMPT_BY_ADMIN,
  CREATE_QUIZ_ATTEMPT_BY_STUDENT,
  GET_ALL_QUIZ_ATTEMPTS,
  GET_QUIZ_ATTEMPT,
  GET_QUIZ_ATTEMPT_BY_STUDENT,
} from "../graphql/operation/quizAttempt.operation.graphql.js";
import { requiredQuizAttemptByStudentFields } from "../graphql/fixture/quizAttempt.fixture.graphql.js";
import {
  createQuizAttemptByAdmin,
  createRandomQuizAttemptByAdmin,
} from "../utils/helper/quizAttempt.helper.js";

let adminCookie: string;
let instructorCookie: string;
let studentCookie: string;
let randomInstructorCookie: string;
let randomStudentCookie: string;
let instructorId: string;
let studentId: string;
let dumyId: string = "6a32819b438924494803bf97";
let course = createRandomCourse();
let courseId: string;
let quizId: string;
let questionBankIdsAndAnswers: { questionId: string; answer: string }[];
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

  questionBankIdsAndAnswers =
    await createRandomQuestionBanksAndGetIdsAndGetAnswers(
      courseId,
      adminCookie,
    );
  questionBankIds = questionBankIdsAndAnswers.map(
    (answer) => answer.questionId,
  );
  let quiz = createRandomQuiz(questionBankIds, courseId);
  quizId = await createQuizAndGetId(quiz, adminCookie);
  await createRandomQuizAttemptByAdmin(
    quizId,
    studentId,
    questionBankIdsAndAnswers,
    adminCookie,
  );
});
const roles = [
  { type: "ADMIN", getCookie: () => adminCookie },
  { type: "INSTRUCTOR", getCookie: () => instructorCookie },
];

describe("Testing student attempts a quiz", () => {
  const schema = CREATE_QUIZ_ATTEMPT_BY_STUDENT;
  describe("Positive", () => {
    let studentCookie: string;
    let studentId: string;
    beforeEach(async () => {
      studentCookie = await createRandomUserAndLoginAndGetCookie(
        "STUDENT",
        adminCookie,
      );
      studentId = await getUserId(studentCookie);
      await enrollStudentAndAccept(studentId, courseId, adminCookie);
    });
    const additionalTests = [
      (response: Response) => {
        expect(response.body.data.createQuizAttemptByStudent).toMatchObject({
          quizId,
          studentId,
        });
      },
      (response: Response) => {
        expect(response.body.data.createQuizAttemptByStudent._id).toBeDefined();
        expect(
          response.body.data.createQuizAttemptByStudent.score,
        ).toBeDefined();
      },
    ];
    const testZeroScore = (response: Response) => {
      expect(response.body.data.createQuizAttemptByStudent.score).toBe(0);
    };
    it(`Should student attempts a quiz with full questions`, async () => {
      const quizAttempt = { quizId, answers: questionBankIdsAndAnswers };
      await test(
        quizAttempt,
        studentCookie,
        schema,
        200,
        "undefined",
        "defined",
        additionalTests,
      );
    });
    it(`Should student attempts a quiz with one question`, async () => {
      const quizAttempt = {
        quizId,
        answers: questionBankIdsAndAnswers.slice(0, 1),
      };
      await test(
        quizAttempt,
        studentCookie,
        schema,
        200,
        "undefined",
        "defined",
        additionalTests,
      );
    });
    it(`Should student attempts a quiz with zero question`, async () => {
      const quizAttempt = {
        quizId,
        answers: [],
      };
      await test(
        quizAttempt,
        studentCookie,
        schema,
        200,
        "undefined",
        "defined",
        [...additionalTests, testZeroScore],
      );
    });

    it(`Should student attempts a quiz with full wrong questions`, async () => {
      const answers = questionBankIdsAndAnswers.map((answer) => ({
        questionId: answer.questionId,
        answer: "WRONG",
      }));
      const quizAttempt = {
        quizId,
        answers: answers,
      };
      await test(
        quizAttempt,
        studentCookie,
        schema,
        200,
        "undefined",
        "defined",
        [...additionalTests, testZeroScore],
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
      {
        type: "INSTRUCTOR",
        getCookie: () => instructorCookie,
      },
    ];
    const roles = [{ type: "STUDENT", getCookie: () => studentCookie }];

    testCommon(
      schema,
      () => ({ quizId, answers: questionBankIdsAndAnswers }),
      invalidAuthorizationSecinaros,
      requiredQuizAttemptByStudentFields,
      roles,
      ["quizId"],
    );
    describe("Should return Object Not found if a question id is not found", () => {
      it(`Should return Object Not found if a question id is not found `, async () => {
        const quizAttempt = {
          quizId,
          answers: [
            ...questionBankIdsAndAnswers,
            { questionId: dumyId, answer: "AAAAAA" },
          ],
        };
        await test(
          quizAttempt,
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

describe("Testing admin makes a student attempts a quiz", () => {
  const schema = CREATE_QUIZ_ATTEMPT_BY_ADMIN;
  describe("Positive", () => {
    let studentCookie: string;
    let studentId: string;
    beforeEach(async () => {
      studentCookie = await createRandomUserAndLoginAndGetCookie(
        "STUDENT",
        adminCookie,
      );
      studentId = await getUserId(studentCookie);
      await enrollStudentAndAccept(studentId, courseId, adminCookie);
    });
    const additionalTests = [
      (response: Response) => {
        expect(response.body.data.createQuizAttemptByAdmin).toMatchObject({
          quizId,
          studentId,
        });
      },
      (response: Response) => {
        expect(response.body.data.createQuizAttemptByAdmin._id).toBeDefined();
        expect(response.body.data.createQuizAttemptByAdmin.score).toBeDefined();
      },
    ];
    const testZeroScore = (response: Response) => {
      expect(response.body.data.createQuizAttemptByAdmin.score).toBe(0);
    };
    it(`Should student attempts a quiz with full questions`, async () => {
      const quizAttempt = {
        quizId,
        studentId,
        answers: questionBankIdsAndAnswers,
      };
      await test(
        quizAttempt,
        adminCookie,
        schema,
        200,
        "undefined",
        "defined",
        additionalTests,
      );
    });
    it(`Should student attempts a quiz with one question`, async () => {
      const quizAttempt = {
        quizId,
        studentId,
        answers: questionBankIdsAndAnswers.slice(0, 1),
      };
      await test(
        quizAttempt,
        adminCookie,
        schema,
        200,
        "undefined",
        "defined",
        additionalTests,
      );
    });
    it(`Should student attempts a quiz with zero question`, async () => {
      const quizAttempt = {
        quizId,
        studentId,
        answers: [],
      };
      await test(
        quizAttempt,
        adminCookie,
        schema,
        200,
        "undefined",
        "defined",
        [...additionalTests, testZeroScore],
      );
    });
    it(`Should student attempts a quiz with full wrong questions`, async () => {
      const answers = questionBankIdsAndAnswers.map((answer) => ({
        questionId: answer.questionId,
        answer: "WRONG",
      }));
      const quizAttempt = {
        quizId,
        studentId,
        answers: answers,
      };
      await test(
        quizAttempt,
        adminCookie,
        schema,
        200,
        "undefined",
        "defined",
        [...additionalTests, testZeroScore],
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
      {
        type: "INSTRUCTOR",
        getCookie: () => instructorCookie,
      },
    ];
    const roles = [{ type: "ADMIN", getCookie: () => adminCookie }];

    testCommon(
      schema,
      () => ({ quizId, studentId, answers: questionBankIdsAndAnswers }),
      invalidAuthorizationSecinaros,
      requiredQuizAttemptByStudentFields,
      roles,
      ["quizId", "studentId"],
    );
    describe("Should return Object Not found if a question id is not found", () => {
      it(`Should return Object Not found if a question id is not found`, async () => {
        const quizAttempt = {
          quizId,
          studentId,
          answers: [
            ...questionBankIdsAndAnswers,
            { questionId: dumyId, answer: "AAAAAA" },
          ],
        };
        await test(
          quizAttempt,
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

describe("Testing get all quiz attempts", () => {
  const schema = GET_ALL_QUIZ_ATTEMPTS;
  describe("Positive", () => {
    roles.forEach((role) => {
      it(`Should ${role.type} get all quiz attempts`, async () => {
        const additionalTests = [
          (response: Response) => {
            expect(
              response.body.data.quizAttempts.length,
            ).toBeGreaterThanOrEqual(1);
          },
          (response: Response) => {
            const objects = response.body.data.quizAttempts;
            for (let object of objects) {
              expect(object._id).toBeDefined();
              expect(object.studentId).toBeDefined();
              expect(object.quizId).toBeDefined();
              expect(object.score).toBeDefined();
            }
          },
        ];
        await test(
          { quizId },
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
    const requiredFields = [{ name: "quizId", domain: "ID" }] as const;
    testCommon(
      schema,
      () => ({ quizId }),
      invalidAuthorizationSecinaros,
      requiredFields,
      roles,
      ["quizId"],
    );
    describe("Should return [] for a new quiz", () => {
      let quizId: string;
      beforeAll(async () => {
        let quiz = createRandomQuiz(questionBankIds, courseId);
        quizId = await createQuizAndGetId(quiz, adminCookie);
      });
      roles.forEach((role) => {
        it(`Should ${role.type} gets [] for a new quiz`, async () => {
          const additionalTests = [
            (response: Response) => {
              expect(response.body.data.quizAttempts.length).toBe(0);
            },
          ];
          await test(
            { quizId },
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

describe("Testing get a quiz attempt by Student", () => {
  const schema = GET_QUIZ_ATTEMPT_BY_STUDENT;
  let studentCookie: string;
  let studentId: string;
  beforeAll(async () => {
    studentCookie = await createRandomUserAndLoginAndGetCookie(
      "STUDENT",
      adminCookie,
    );
    studentId = await getUserId(studentCookie);
    await enrollStudentAndAccept(studentId, courseId, adminCookie);
    await createRandomQuizAttemptByAdmin(
      quizId,
      studentId,
      questionBankIdsAndAnswers,
      adminCookie,
    );
  });
  describe("Positive", () => {
    it(`Should STUDENT gets quiz attempt`, async () => {
      const additionalTests = [
        (response: Response) => {
          expect(response.body.data.quizAttemptByStudent).toMatchObject({
            quizId,
            studentId,
          });
        },
        (response: Response) => {
          expect(response.body.data.quizAttemptByStudent._id).toBeDefined();
        },
      ];
      await test(
        { quizId },
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
    const roles = [{ type: "STUDENT", getCookie: () => studentCookie }];
    const invalidAuthorizationSecinaros = [
      { type: "ADMIN", getCookie: () => adminCookie },
      {
        type: "INSTRUCTOR",
        getCookie: () => instructorCookie,
      },
    ];
    const requiredFields = [{ name: "quizId", domain: "ID" }] as const;

    testCommon(
      schema,
      () => ({ quizId }),
      invalidAuthorizationSecinaros,
      requiredFields,
      roles,
      ["quizId"],
    );
  });
});

describe("Testing get a quiz attempt by admin and instructor", () => {
  const schema = GET_QUIZ_ATTEMPT;
  let studentCookie: string;
  let studentId: string;
  beforeAll(async () => {
    studentCookie = await createRandomUserAndLoginAndGetCookie(
      "STUDENT",
      adminCookie,
    );
    studentId = await getUserId(studentCookie);
    await enrollStudentAndAccept(studentId, courseId, adminCookie);
    await createRandomQuizAttemptByAdmin(
      quizId,
      studentId,
      questionBankIdsAndAnswers,
      adminCookie,
    );
  });
  describe("Positive", () => {
    roles.forEach((role) => {
      it(`Should ${role.type} gets quiz attempt`, async () => {
        const additionalTests = [
          (response: Response) => {
            expect(response.body.data.quizAttempt).toMatchObject({
              quizId,
              studentId,
            });
          },
          (response: Response) => {
            expect(response.body.data.quizAttempt._id).toBeDefined();
          },
        ];
        await test(
          { quizId, studentId },
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
    const requiredFields = [
      { name: "quizId", domain: "ID" },
      { name: "studentId", domain: "ID" },
    ] as const;

    testCommon(
      schema,
      () => ({ quizId, studentId }),
      invalidAuthorizationSecinaros,
      requiredFields,
      roles,
      ["quizId", "studentId"],
    );
  });
});
