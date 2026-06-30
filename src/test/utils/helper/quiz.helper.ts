import { graphqlRequest } from "../graphql-client.js";
import { CREATE_QUIZ } from "../../graphql/operation/quiz.operation.graphql.js";
import { createRandomQuiz } from "../factory/quiz.factory.js";

export async function createQuizAndGetId(quiz: unknown, adminCookie: string) {
  const response = await graphqlRequest()
    .set("Cookie", adminCookie)
    .send({
      query: CREATE_QUIZ,
      variables: {
        input: quiz,
      },
    });
  console.log(response.body);

  return response.body.data.createQuiz._id;
}
export async function createRandomQuizAndGetId(
  courseId: string,
  questionIds: string[],
  adminCookie: string,
) {
  const quiz = createRandomQuiz(questionIds, courseId);
  return await createQuizAndGetId(quiz, adminCookie);
}
