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
  CREATE_ASSIGNMENT,
  DELETE_ASSIGNMENT_BY_ID,
  GET_ALL_ASSIGNMENTS,
  GET_ASSIGNMENT_BY_ID,
  GET_ASSIGNMENT_OTP_BY_ID,
  UPDATE_ASSIGNMENT_BY_ID,
} from "../graphql/operation/assignment.operation.graphql.js";
import { createRandomAssignment } from "../utils/factory/assignment.factory.js";
import {
  requiredAssignmentFields,
  updateAssignmentFields,
} from "../graphql/fixture/assignment.fixture.graphql.js";
import { courseEndDate } from "../utils/date-builder.js";
import {
  createAssignmentAndGetId,
  createRandomAssignmentAndGetId,
} from "../utils/helper/assignment.helper.js";
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
let assignment = createRandomAssignment();
let courseId: string;
let assignmentId: string;
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
  assignment = createRandomAssignment(courseId);
  assignmentId = await createAssignmentAndGetId(assignment, adminCookie);
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
describe("Testing create assignment", () => {
  const schema = CREATE_ASSIGNMENT;
  describe("Positive", () => {
    roles.forEach((role) => {
      it(`Should ${role.type} creates a new assignment`, async () => {
        const assignment = createRandomAssignment(courseId);
        const additionalTests = [
          (response: Response) => {
            expect(response.body.data.createAssignment).toMatchObject(
              assignment,
            );
          },
          (response: Response) => {
            expect(response.body.data.createAssignment._id).toBeDefined();
          },
        ];
        await test(
          assignment,
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
      () => createRandomAssignment(courseId),
      invalidAuthorizationSecinaros,
      requiredAssignmentFields,
      roles,
      [],
      { duration: true },
      "Object",
    );
  });
});

describe("Testing delete assignment by id", () => {
  const schema = DELETE_ASSIGNMENT_BY_ID;
  describe("Positive", () => {
    let assignmentId: string;
    beforeEach(async () => {
      assignmentId = await createRandomAssignmentAndGetId(
        courseId,
        adminCookie,
      );
    });

    roles.forEach((role) => {
      it(`Should ${role.type} deletes a assignment by id`, async () => {
        const additionalTests = [
          (response: Response) => {
            expect(response.body.data.deleteAssignmentById).toBe(true);
          },
        ];
        await test(
          { _id: assignmentId },
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
      () => ({ _id: assignmentId }),
      invalidAuthorizationSecinaros,
      idField,
      roles,
      ["_id"],
    );
  });
});

describe("Testing get all assignments", () => {
  const schema = GET_ALL_ASSIGNMENTS;
  const roles = [
    { type: "ADMIN", getCookie: () => adminCookie },
    { type: "INSTRUCTOR", getCookie: () => instructorCookie },
    { type: "STUDENT", getCookie: () => studentCookie },
  ];
  describe("Positive", () => {
    roles.forEach((role) => {
      it(`Should ${role.type} get all assignments`, async () => {
        const additionalTests = [
          (response: Response) => {
            expect(
              response.body.data.assignments.length,
            ).toBeGreaterThanOrEqual(1);
          },
          (response: Response) => {
            const objects = response.body.data.assignments;
            for (let object of objects) {
              expect(object._id).toBeDefined();
              expect(object.courseId).toBeDefined();
              expect(object.title).toBeDefined();
              expect(object.description).toBeDefined();
              expect(object.score).toBeDefined();
              expect(object.startDate).toBeDefined();
              expect(object.endDate).toBeDefined();
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
              expect(response.body.data.assignments.length).toBe(0);
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

describe("Testing get assignment by id", () => {
  const schema = GET_ASSIGNMENT_BY_ID;
  describe("Positive", () => {
    roles.forEach((role) => {
      it(`Should ${role.type} gets assignment by id`, async () => {
        const additionalTests = [
          (response: Response) => {
            expect(response.body.data.assignment).toMatchObject(assignment);
          },
          (response: Response) => {
            expect(response.body.data.assignment._id).toBeDefined();
          },
        ];
        await test(
          { _id: assignmentId },
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
      () => ({ _id: assignmentId }),
      invalidAuthorizationSecinaros,
      idField,
      roles,
      ["_id"],
    );
  });
});

describe("Testing update assignment by id", () => {
  const schema = UPDATE_ASSIGNMENT_BY_ID;
  describe("Positive", () => {
    const additionalTests = [
      (response: Response) => {
        expect(response.body.data.updateAssignmentById).toBe(true);
      },
    ];
    describe("Update many fields", () => {
      let assignmentId: string;
      beforeEach(async () => {
        assignmentId = await createRandomAssignmentAndGetId(
          courseId,
          adminCookie,
        );
      });
      roles.forEach((role) => {
        it(`Should ${role.type} updates all assignments fields`, async () => {
          const newassignment = createRandomAssignment();
          delete newassignment.courseId;
          const input = {
            _id: assignmentId,
            ...newassignment,
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
      let assignmentId: string;
      beforeAll(async () => {
        assignmentId = await createRandomAssignmentAndGetId(
          courseId,
          adminCookie,
        );
      });
      roles.forEach((role) => {
        const newassignment = createRandomAssignment();
        delete newassignment.courseId;
        updateAssignmentFields.forEach((field) => {
          it(`Should ${role.type} updates only one course field (${field.name})`, async () => {
            const input = {
              _id: assignmentId,
              [field.name]: newassignment[field.name],
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
      ...updateAssignmentFields,
      { name: "_id", domain: "ID" },
    ] as const;
    testCommon(
      schema,
      () => ({ _id: assignmentId }),
      invalidAuthorizationSecinaros,
      requiredFields,
      roles,
      ["_id"],
      { allowMissing: true, duration: true },
      "Object",
    );
  });
});
