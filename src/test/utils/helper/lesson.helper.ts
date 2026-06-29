import { graphqlRequest } from "../graphql-client.js";
import {
  CREATE_LESSON,
  GET_LESSON_OTP_BY_ID,
} from "../../graphql/operation/lesson.operation.graphql.js";
import { createRandomLesson } from "../factory/lesson.factory.js";

export async function createLessonAndGetId(
  lesson: unknown,
  adminCookie: string,
) {
  const response = await graphqlRequest()
    .set("Cookie", adminCookie)
    .send({
      query: CREATE_LESSON,
      variables: {
        input: lesson,
      },
    });
  return response.body.data.createLesson._id;
}
export async function createRandomLessonAndGetId(
  courseId: string,
  adminCookie: string,
) {
  const lesson = createRandomLesson(courseId);
  return await createLessonAndGetId(lesson, adminCookie);
}

export async function getLessonOTPById(lessonId: string, adminCookie: string) {
  const response = await graphqlRequest()
    .set("Cookie", adminCookie)
    .send({
      query: GET_LESSON_OTP_BY_ID,
      variables: {
        input: { _id: lessonId },
      },
    });
  return response.body.data.lessonOTP;
}
