import * as quizService from "../service/quiz.service.js";

import {
  Context,
  CourseIdArgs,
  IdArgs,
} from "../graphql/interface/interface.graphql.js";

import {
  CreateQuizArgs,
  UpdateQuizByIdArgs,
} from "../graphql/interface/quiz.interface.graphql.js";
import { Quiz } from "../model/quiz.model.js";

export async function createQuiz(
  _: unknown,
  args: CreateQuizArgs,
  context: Context,
  ___: unknown,
): Promise<Quiz> {
  const result = await quizService.createQuiz(args.input);
  return result;
}

export async function deleteQuizById(
  _: unknown,
  args: IdArgs,
  __: Context,
  ___: unknown,
): Promise<boolean> {
  const result = await quizService.deleteCourseById(args.input._id);
  return result;
}

export async function getAllQuizzes(
  _: unknown,
  args: CourseIdArgs,
  __: Context,
  ___: unknown,
): Promise<Quiz[]> {
  const result = await quizService.getAllQuizzes(args.input.courseId);
  return result;
}

export async function getQuizById(
  _: unknown,
  args: IdArgs,
  __: Context,
  ___: unknown,
): Promise<Quiz> {
  const result = await quizService.getQuizById(args.input._id);
  return result;
}

export async function updateQuizById(
  _: unknown,
  args: UpdateQuizByIdArgs,
  __: Context,
  ___: unknown,
): Promise<Boolean> {
  const _id = args.input._id;
  const result = await quizService.updateQuizById(_id, args.input);
  return result;
}
