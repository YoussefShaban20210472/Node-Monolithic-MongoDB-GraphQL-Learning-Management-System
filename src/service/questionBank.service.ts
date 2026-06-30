import User from "../model/user.model.js";
import * as questionBankRepository from "../repository/questionBank.repository.js";

import { BadRequest, ObjectNotFound } from "../error/business.error.js";
import {
  courseSchema,
  updateCourseSchema,
} from "../validator/course.validator.js";
import { CourseGraphql } from "../graphql/interface/course.interface.graphql.js";
import {
  assertValidTimeAndDuration,
  courseIdSchema,
  idSchema,
} from "../validator/validator.js";
import { Course } from "../model/course.model.js";
import { QuestionBank } from "../model/questionBank.model.js";
import { generateOTP } from "../utils/otp.js";
import { getPartialCourseById } from "./course.service.js";
import {
  questionBankSchema,
  updateQuestionBankSchema,
} from "../validator/questionBank.validator.js";

export async function isInstructorIsQuestionBankCreator(
  instructorId: string,
  _id: string,
) {
  const questionBank = await questionBankRepository.getQuestionBankById(_id);
  if (questionBank == null) {
    return false;
  }

  return questionBank?.instructorId?.toString() === instructorId;
}
export async function createQuestionBank(questionBank: QuestionBank) {
  questionBankSchema.parse(questionBank);
  const course = await getPartialCourseById(questionBank.courseId.toString());

  questionBank.instructorId = course?.instructorId;
  const result = await questionBankRepository.createQuestionBank(questionBank);
  delete result.instructorId;
  return result;
}

export async function deleteCourseById(_id: string) {
  idSchema.parse({ _id });
  const result = await questionBankRepository.deleteQuestionBankById(_id);
  if (!result) {
    throw new ObjectNotFound("Question Bank");
  }
  return result;
}

export async function getAllQuestionBank(courseId: string) {
  courseIdSchema.parse({ courseId });
  const result = await questionBankRepository.getAllQuestionBank(courseId);
  return result;
}

export async function getQuestionBankById(_id: string) {
  idSchema.parse({ _id });
  const result = await questionBankRepository.getQuestionBankById(_id);
  if (result == null) {
    throw new ObjectNotFound("Question Bank");
  }
  delete result.instructorId;
  return result;
}

export async function updateQuestionBankById(
  _id: string,
  data: Partial<QuestionBank>,
) {
  idSchema.parse({ _id });
  const updateQuestionBankFields = [
    "question",
    "answer",
    "type",
    // "score",
    // "choices",
  ] as const;
  const safeData: Partial<QuestionBank> = {};
  for (let field of updateQuestionBankFields) {
    if (data[field] != null) {
      safeData[field] = data[field];
    }
  }
  if (data.score != null) {
    safeData.score = data.score;
  }
  if (data.choices != null) {
    safeData.choices = data.choices;
  }
  if (Object.keys(safeData).length === 0) {
    throw new BadRequest(
      "At least one field must be provided to update question Bank",
    );
  }

  const oldQuestionBank = await getQuestionBankById(_id);
  if (data.type == null) {
    data.type = oldQuestionBank?.type;
  }
  if (data.choices == null) {
    data.choices = oldQuestionBank?.choices;
  }
  if (data.answer == null) {
    data.answer = oldQuestionBank?.answer;
  }

  updateQuestionBankSchema.parse(data);

  const result = await questionBankRepository.updateQuestionBankById(
    _id,
    safeData,
  );

  if (!result) {
    throw new ObjectNotFound("Question Bank");
  }
  return result;
}
