import { graphqlRequest } from "../graphql-client.js";
import { LOGIN } from "../../graphql/operation/auth.operation.graphql.js";
import { createRandomUser } from "../factory/user.factory.js";
import {
  CREATE_USER,
  GET_ME,
} from "../../graphql/operation/user.operation.graphql.js";
import { adminLogin } from "../../graphql/fixture/user.fixture.graphql.js";
import { CREATE_COURSE_BY_INSTRUCTOR } from "../../graphql/operation/course.operation.graphql.js";
import { createRandomCourse } from "../factory/course.factory.js";

export async function loginAndGetCookie(account: {
  email?: string;
  password?: string;
}) {
  const response = await graphqlRequest().send({
    query: LOGIN,
    variables: {
      input: account,
    },
  });
  return response.headers["set-cookie"];
}

export async function createCourseAndGetId(
  course: unknown,
  instructorCookie: string,
) {
  const response = await graphqlRequest()
    .set("Cookie", instructorCookie)
    .send({
      query: CREATE_COURSE_BY_INSTRUCTOR,
      variables: {
        input: course,
      },
    });
  return response.body.data.createCourseByInstructor._id;
}
export async function createRandomCourseAndGetId(instructorCookie: string) {
  const course = createRandomCourse();
  return await createCourseAndGetId(course, instructorCookie);
}
