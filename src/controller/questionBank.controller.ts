import * as questionBankService from "../service/questionBank.service.js";

import {
  Context,
  CourseIdArgs,
  IdArgs,
} from "../graphql/interface/interface.graphql.js";
import {
  CourseGraphql,
  CreateCourseByAdminArgs,
  CreateCourseByInstructorArgs,
  UpdateCourseByIdArgs,
} from "../graphql/interface/course.interface.graphql.js";
import {
  CreateQuestionBankArgs,
  CreateQuestionBankInput,
  UpdateQuestionBankByIdArgs,
} from "../graphql/interface/questionBank.interface.graphql.js";
import { QuestionBank } from "../model/questionBank.model.js";

export async function createQuestionBank(
  _: unknown,
  args: CreateQuestionBankArgs,
  context: Context,
  ___: unknown,
): Promise<QuestionBank> {
  const result = await questionBankService.createQuestionBank(args.input);
  return result;
}

export async function deleteQuestionBankById(
  _: unknown,
  args: IdArgs,
  __: Context,
  ___: unknown,
): Promise<boolean> {
  const result = await questionBankService.deleteCourseById(args.input._id);
  return result;
}

export async function getAllQuestionBank(
  _: unknown,
  args: CourseIdArgs,
  __: Context,
  ___: unknown,
): Promise<QuestionBank[]> {
  const result = await questionBankService.getAllQuestionBank(
    args.input.courseId,
  );
  return result;
}

export async function getQuestionBankById(
  _: unknown,
  args: IdArgs,
  __: Context,
  ___: unknown,
): Promise<QuestionBank> {
  const result = await questionBankService.getQuestionBankById(args.input._id);
  return result;
}

export async function updateQuestionBankById(
  _: unknown,
  args: UpdateQuestionBankByIdArgs,
  __: Context,
  ___: unknown,
): Promise<Boolean> {
  const _id = args.input._id;
  const result = await questionBankService.updateQuestionBankById(
    _id,
    args.input,
  );
  return result;
}
