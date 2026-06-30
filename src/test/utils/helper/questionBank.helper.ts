import { graphqlRequest } from "../graphql-client.js";
import {
  CREATE_QUESTION_BANK,
  GET_QUESTION_BANK_OTP_BY_ID,
} from "../../graphql/operation/questionBank.operation.graphql.js";
import { createRandomQuestionBank } from "../factory/questionBank.factory.js";

export async function createQuestionBankAndGetId(
  questionBank: unknown,
  adminCookie: string,
) {
  const response = await graphqlRequest()
    .set("Cookie", adminCookie)
    .send({
      query: CREATE_QUESTION_BANK,
      variables: {
        input: questionBank,
      },
    });
  return response.body.data.createQuestionBank._id;
}
export async function createRandomQuestionBankAndGetId(
  courseId: string,
  type: string,
  adminCookie: string,
) {
  const questionBank = createRandomQuestionBank(type, courseId);
  return await createQuestionBankAndGetId(questionBank, adminCookie);
}
