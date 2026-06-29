import { graphqlRequest } from "../graphql-client.js";
import {
  CREATE_LESSON,
  GET_LESSON_OTP_BY_ID,
} from "../../graphql/operation/lesson.operation.graphql.js";
import { createRandomLesson } from "../factory/lesson.factory.js";
import { ATTEND_STUDENT_BY_ADMIN } from "../../graphql/operation/attendance.operation.graphql.js";
import { expect } from "vitest";

export async function attendStudent(
  studentId: string,
  lessonId: string,
  otp: string,
  adminCookie: string,
) {
  const response = await graphqlRequest()
    .set("Cookie", adminCookie)
    .send({
      query: ATTEND_STUDENT_BY_ADMIN,
      variables: {
        input: { studentId, lessonId, otp },
      },
    });
  expect(response.body.data.attendStudentByAdmin._id).toBeDefined();
}
