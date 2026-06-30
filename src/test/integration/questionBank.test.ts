import { describe, it, expect, beforeAll } from "vitest";
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
  CREATE_QUESTION_BANK,
  DELETE_QUESTION_BANK_BY_ID,
  GET_ALL_QUESTION_BANK,
  GET_QUESTION_BANK_BY_ID,
  UPDATE_QUESTION_BANK_BY_ID,
} from "../graphql/operation/questionBank.operation.graphql.js";
import { createRandomQuestionBank } from "../utils/factory/questionBank.factory.js";
import {
  requiredQuestionBankFields,
  updateQuestionBankFields,
} from "../graphql/fixture/questionBank.fixture.graphql.js";

import { enrollStudentAndAccept } from "../utils/helper/enrollment.helper.js";
import {
  createQuestionBankAndGetId,
  createRandomQuestionBankAndGetId,
} from "../utils/helper/questionBank.helper.js";

let adminCookie: string;
let instructorCookie: string;
let studentCookie: string;
let randomInstructorCookie: string;
let randomStudentCookie: string;
let instructorId: string;
let studentId: string;
let dumyId: string = "6a32819b438924494803bf97";
let course = createRandomCourse();
let questionBank = createRandomQuestionBank("MCQ", "");
let courseId: string;
let questionBankId: string;
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
  questionBank = createRandomQuestionBank("MCQ", courseId);
  questionBankId = await createQuestionBankAndGetId(questionBank, adminCookie);
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
const types = ["MCQ", "TRUE_FALSE", "SHORT_ANSWER"];
describe("Testing create a question bank", () => {
  const schema = CREATE_QUESTION_BANK;
  describe("Positive", () => {
    roles.forEach((role) => {
      types.forEach((type) => {
        it(`Should ${role.type} creates a new question Bank`, async () => {
          const questionBank = createRandomQuestionBank(type, courseId);
          const additionalTests = [
            (response: Response) => {
              expect(response.body.data.createQuestionBank).toMatchObject({
                question: questionBank.question,
                answer: questionBank.answer,
                score: questionBank.score,
                type: questionBank.type,
                choices: questionBank.choices,
                courseId: questionBank.courseId,
              });
            },
            (response: Response) => {
              expect(response.body.data.createQuestionBank._id).toBeDefined();
            },
          ];
          await test(
            questionBank,
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
    testCommon(
      schema,
      () => createRandomQuestionBank("MCQ", courseId),
      invalidAuthorizationSecinaros,
      requiredQuestionBankFields,
      roles,
      ["courseId"],
    );
  });

  describe("Negative", () => {
    describe("Should return bad request if question type is not mcq and choice is not empty", () => {
      roles.forEach((role) => {
        types.slice(1).forEach((type) => {
          it(`Should return bad request if question type is not mcq and choice is not empty (${role.type})`, async () => {
            const questionBank = createRandomQuestionBank("MCQ", courseId);
            questionBank.type = type;
            await test(
              questionBank,
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
    describe("Should return 400 if question type is mcq and choice doesn't contain the correct answer", () => {
      roles.forEach((role) => {
        it(`Should return 400 if question type is mcq and choice doesn't contain the correct answer (${role.type})`, async () => {
          const questionBank = createRandomQuestionBank("mcq", courseId);
          questionBank.choices[0] = "wrong";
          await test(
            questionBank,
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
    describe("Should return 400 if question type is mcq and choice length is less than 2", () => {
      roles.forEach((role) => {
        it(`Should return 400 if question type is mcq and choice length is less than 2 (${role.type})`, async () => {
          const questionBank = createRandomQuestionBank("mcq", courseId);
          questionBank.choices = [questionBank.answer];
          await test(
            questionBank,
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

describe("Testing delete question Bank by id", () => {
  const schema = DELETE_QUESTION_BANK_BY_ID;
  describe("Positive", () => {
    roles.forEach((role) => {
      types.forEach((type) => {
        it(`Should ${role.type} deletes a questionBank by id`, async () => {
          const questionBankId = await createRandomQuestionBankAndGetId(
            courseId,
            type,
            adminCookie,
          );
          const additionalTests = [
            (response: Response) => {
              expect(response.body.data.deleteQuestionBankById).toBe(true);
            },
          ];
          await test(
            { _id: questionBankId },
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
    let questionBankId: string;
    beforeAll(async () => {
      questionBankId = await createRandomQuestionBankAndGetId(
        courseId,
        "MCQ",
        adminCookie,
      );
    });
    testCommon(
      schema,
      () => ({ _id: questionBankId }),
      invalidAuthorizationSecinaros,
      idField,
      roles,
      ["_id"],
    );
  });
});

describe("Testing get all question Bank", () => {
  const schema = GET_ALL_QUESTION_BANK;
  const roles = [
    { type: "ADMIN", getCookie: () => adminCookie },
    { type: "INSTRUCTOR", getCookie: () => instructorCookie },
    { type: "STUDENT", getCookie: () => studentCookie },
  ];
  describe("Positive", () => {
    roles.forEach((role) => {
      it(`Should ${role.type} get all question Bank`, async () => {
        const additionalTests = [
          (response: Response) => {
            expect(
              response.body.data.allQuestionBank.length,
            ).toBeGreaterThanOrEqual(1);
          },
          (response: Response) => {
            const objects = response.body.data.allQuestionBank;
            for (let object of objects) {
              expect(object._id).toBeDefined();
              expect(object.courseId).toBeDefined();
              expect(object.question).toBeDefined();
              expect(object.answer).toBeDefined();
              expect(object.score).toBeDefined();
              expect(object.type).toBeDefined();
              expect(object.choices).toBeDefined();
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
              expect(response.body.data.allQuestionBank.length).toBe(0);
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

describe("Testing get a question Bank by id", () => {
  const schema = GET_QUESTION_BANK_BY_ID;
  describe("Positive", () => {
    roles.forEach((role) => {
      it(`Should ${role.type} gets a question Bank by id`, async () => {
        const additionalTests = [
          (response: Response) => {
            expect(response.body.data.questionBank).toMatchObject({
              question: questionBank.question,
              answer: questionBank.answer,
              score: questionBank.score,
              type: questionBank.type,
              choices: questionBank.choices,
              courseId: questionBank.courseId,
            });
          },
          (response: Response) => {
            expect(response.body.data.questionBank._id).toBeDefined();
          },
        ];
        await test(
          { _id: questionBankId },
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
      () => ({ _id: questionBankId }),
      invalidAuthorizationSecinaros,
      idField,
      roles,
      ["_id"],
    );
  });
});

describe("Testing update a question Bank by id", () => {
  const schema = UPDATE_QUESTION_BANK_BY_ID;
  describe("Positive", () => {
    const additionalTests = [
      (response: Response) => {
        expect(response.body.data.updateQuestionBankById).toBe(true);
      },
    ];
    describe("Update many fields", () => {
      roles.forEach((role) => {
        types.forEach((type) => {
          it(`Should ${role.type} updates all question Bank fields`, async () => {
            let questionBankId = await createRandomQuestionBankAndGetId(
              courseId,
              type,
              adminCookie,
            );
            const randomType = types[Math.floor(Math.random() * types.length)];
            const newQuestionBank = createRandomQuestionBank(
              randomType,
              courseId,
            );
            delete newQuestionBank.courseId;
            const input = {
              _id: questionBankId,
              ...newQuestionBank,
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
    describe("Update one field", () => {
      roles.forEach((role) => {
        types.forEach((type) => {
          updateQuestionBankFields.forEach((field) => {
            it(`Should ${role.type} updates only one question field (${type}) (${field.name})`, async () => {
              const questionBank = createRandomQuestionBank(type, courseId);
              const questionBankId = await createQuestionBankAndGetId(
                questionBank,
                adminCookie,
              );
              const differentType =
                type === "MCQ"
                  ? "MCQ"
                  : type === "TRUE_FALSE"
                    ? "SHORT_ANSWER"
                    : "TRUE_FALSE";
              const newQuestionBank = createRandomQuestionBank(
                differentType,
                courseId,
              );
              delete newQuestionBank.courseId;
              if (type === "MCQ") {
                if (field.name === "answer") {
                  newQuestionBank.answer = questionBank.choices[1];
                } else if (field.name === "choices") {
                  newQuestionBank.choices[0] = questionBank.answer;
                }
              }
              const input = {
                _id: questionBankId,
                [field.name]: newQuestionBank[field.name],
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
  });

  describe("Negative", () => {
    const requiredFields = [
      ...updateQuestionBankFields,
      { name: "_id", domain: "ID" },
    ] as const;
    const questionBank = createRandomQuestionBank("MCQ", "");
    delete questionBank.courseId;

    testCommon(
      schema,
      () => ({
        _id: questionBankId,
      }),
      invalidAuthorizationSecinaros,
      requiredFields,
      roles,
      ["_id"],
      { allowMissing: true },
    );
  });
  describe("Negative", () => {
    describe("Should return bad request if question type is not mcq and choice is not empty", () => {
      roles.forEach((role) => {
        types.slice(1).forEach((type) => {
          it(`Should return bad request if question type is not mcq and choice is not empty (${role.type})`, async () => {
            const questionBankId = await createRandomQuestionBankAndGetId(
              courseId,
              type,
              adminCookie,
            );
            await test(
              { _id: questionBankId, choices: ["aaa", "bbb"] },
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
    describe("Should return bad request if question type is mcq and choice doesn't contain the correct answer", () => {
      roles.forEach((role) => {
        it(`Should return bad request if question type is mcq and choice doesn't contain the correct answer (${role.type})`, async () => {
          const questionBankId = await createRandomQuestionBankAndGetId(
            courseId,
            "MCQ",
            adminCookie,
          );
          await test(
            { _id: questionBankId, choices: ["aaa", "bbb"] },
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
    describe("Should return bad request if question type is mcq and choice length is less than 2", () => {
      roles.forEach((role) => {
        it(`Should return bad request if question type is mcq and choice length is less than 2 (${role.type})`, async () => {
          const questionBank = createRandomQuestionBank("MCQ", courseId);
          const questionBankId = await createQuestionBankAndGetId(
            questionBank,
            adminCookie,
          );
          await test(
            { _id: questionBankId, choices: [questionBank.answer] },
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
