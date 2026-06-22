import { graphqlRequest } from "../graphql-client.js";

import {
  CONFIRM_ENROLLMENT,
  ENROLL_STUDENT_BY_ADMIN,
  ENROLL_STUDENT_BY_STUDENT,
} from "../../graphql/operation/enrollment.operation.graphql.js";
import { expect } from "vitest";

export async function enrollStudent(studentCookie: string, courseId: string) {
  const response = await graphqlRequest()
    .set("Cookie", studentCookie)
    .send({
      query: ENROLL_STUDENT_BY_STUDENT,
      variables: {
        input: { courseId },
      },
    });
  expect(response.body.data.enrollStudentByStudent._id).toBeDefined();
}
export async function enrollStudentById(
  studentId: string,
  courseId: string,
  adminCookie: string,
) {
  const response = await graphqlRequest()
    .set("Cookie", adminCookie)
    .send({
      query: ENROLL_STUDENT_BY_ADMIN,
      variables: {
        input: { courseId, studentId },
      },
    });
  expect(response.body.data.enrollStudentByAdmin._id).toBeDefined();
}
export async function confirmEnrollment(
  studentId: string,
  courseId: string,
  adminCookie: string,
  status: string,
) {
  const response = await graphqlRequest()
    .set("Cookie", adminCookie)
    .send({
      query: CONFIRM_ENROLLMENT,
      variables: {
        input: { courseId, studentId, status },
      },
    });
  expect(response.body.data.confirmEnrollment).toBe(true);
}
