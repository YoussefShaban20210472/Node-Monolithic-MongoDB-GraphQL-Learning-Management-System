import * as quizAttemptService from "../service/quizAttempt.service.js";

import { Context } from "../graphql/interface/interface.graphql.js";
import {
  CreateQuizAttemptByAdminArgs,
  CreateQuizAttemptByStudentArgs,
  GetQuizAttemptArgs,
} from "../graphql/interface/quizAttempt.interface.graphql.js";
import { QuizIdArgs } from "../graphql/interface/quiz.interface.graphql.js";

export async function createQuizAttemptByStudent(
  _: unknown,
  args: CreateQuizAttemptByStudentArgs,
  context: Context,
  __: unknown,
) {
  const _id = context.req.session.userId!;
  return await quizAttemptService.createQuizAttempt({
    ...args.input,
    studentId: _id,
  });
}
export async function createQuizAttemptByAdmin(
  _: unknown,
  args: CreateQuizAttemptByAdminArgs,
  context: Context,
  __: unknown,
) {
  return await quizAttemptService.createQuizAttempt(args.input);
}

export async function getQuizAttemptByStudent(
  _: unknown,
  args: QuizIdArgs,
  context: Context,
  __: unknown,
) {
  const _id = context.req.session.userId!;
  return await quizAttemptService.getQuizAttempt({
    ...args.input,
    studentId: _id,
  });
}

export async function getQuizAttempt(
  _: unknown,
  args: GetQuizAttemptArgs,
  __: Context,
  ___: unknown,
) {
  return await quizAttemptService.getQuizAttempt(args.input);
}
export async function getAllQuizAttempts(
  _: unknown,
  args: QuizIdArgs,
  __: Context,
  ___: unknown,
) {
  return await quizAttemptService.getAllQuizAttempts(args.input.quizId);
}
