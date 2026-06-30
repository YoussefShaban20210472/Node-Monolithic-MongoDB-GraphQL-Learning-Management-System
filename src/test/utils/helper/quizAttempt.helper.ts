import { graphqlRequest } from "../graphql-client.js";
import { CREATE_QUIZ_ATTEMPT_BY_ADMIN } from "../../graphql/operation/quizAttempt.operation.graphql.js";
import { expect } from "vitest";

export async function createQuizAttemptByAdmin(
  quizAttempt: unknown,
  adminCookie: string,
) {
  const response = await graphqlRequest()
    .set("Cookie", adminCookie)
    .send({
      query: CREATE_QUIZ_ATTEMPT_BY_ADMIN,
      variables: {
        input: quizAttempt,
      },
    });
  console.log(response.body);

  expect(response.body.data.createQuizAttemptByAdmin._id).toBeDefined();
}
export async function createRandomQuizAttemptByAdmin(
  quizId: string,
  studentId: string,
  questionIdsAndAnswers: { questionId: string; answer: string }[],
  adminCookie: string,
) {
  const questionAttempt = { quizId, studentId, answers: questionIdsAndAnswers };
  return await createQuizAttemptByAdmin(questionAttempt, adminCookie);
}
