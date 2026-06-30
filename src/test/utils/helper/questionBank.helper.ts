import { graphqlRequest } from "../graphql-client.js";
import { CREATE_QUESTION_BANK } from "../../graphql/operation/questionBank.operation.graphql.js";
import { createRandomQuestionBank } from "../factory/questionBank.factory.js";
const types = ["MCQ", "TRUE_FALSE", "SHORT_ANSWER"];

export async function createQuestionBankAndGetId(
  questionBank: unknown,
  adminCookie: string,
): Promise<string> {
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
): Promise<string> {
  const questionBank = createRandomQuestionBank(type, courseId);
  return await createQuestionBankAndGetId(questionBank, adminCookie);
}

export async function createRandomQuestionBanksAndGetIds(
  courseId: string,
  adminCookie: string,
  minCount: number = 10,
  maxCount: number = 20,
): Promise<string[]> {
  const count =
    Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
  const questionBankIds: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomType = types[Math.floor(Math.random() * types.length)];
    const questionBank = createRandomQuestionBank(randomType, courseId);
    questionBankIds.push(
      await createQuestionBankAndGetId(questionBank, adminCookie),
    );
  }
  return questionBankIds;
}

export async function createRandomQuestionBanksAndGetIdsAndGetAnswers(
  courseId: string,
  adminCookie: string,
  minCount: number = 10,
  maxCount: number = 20,
) {
  const count =
    Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
  const questionBanks: { questionId: string; answer: string }[] = [];
  for (let i = 0; i < count; i++) {
    const randomType = types[Math.floor(Math.random() * types.length)];
    const questionBank = createRandomQuestionBank(randomType, courseId);
    const _id = await createQuestionBankAndGetId(questionBank, adminCookie);
    questionBanks.push({ questionId: _id, answer: questionBank.answer });
  }
  return questionBanks;
}
