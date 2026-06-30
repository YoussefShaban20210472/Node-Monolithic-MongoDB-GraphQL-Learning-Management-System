import * as quizRepository from "../repository/quiz.repository.js";

import { BadRequest, ObjectNotFound } from "../error/business.error.js";
import { updateCourseSchema } from "../validator/course.validator.js";
import {
  assertValidTimeAndDuration,
  courseIdSchema,
  idSchema,
} from "../validator/validator.js";
import { Quiz } from "../model/quiz.model.js";
import { getPartialCourseById } from "./course.service.js";
import { quizSchema, updateQuizSchema } from "../validator/quiz.validator.js";
import { ObjectId } from "mongodb";
import { getQuestionBankById } from "../repository/questionBank.repository.js";

export async function isInstructorIsQuizCreator(
  instructorId: string,
  _id: string,
) {
  const quiz = await quizRepository.getQuizById(_id);
  if (quiz == null) {
    return false;
  }

  return quiz?.instructorId?.toString() === instructorId;
}
async function assertQuestionsExist(questionIds: (string | ObjectId)[]) {
  for (let questionId of questionIds) {
    const reuslt = await getQuestionBankById(questionId.toString());
    if (reuslt === null) {
      throw new ObjectNotFound("Question Id");
    }
  }
}
function convertQuestionsToObjectId(questionIds: (string | ObjectId)[]) {
  return questionIds.map((id) => new ObjectId(id));
}
export async function createQuiz(quiz: Quiz) {
  quizSchema.parse(quiz);
  const course = await getPartialCourseById(quiz.courseId.toString());

  await assertValidTimeAndDuration(course, quiz, "Quiz");
  quiz.instructorId = course?.instructorId;
  await assertQuestionsExist(quiz.questionIds!);
  quiz.questionIds = convertQuestionsToObjectId(quiz.questionIds!);
  const result = await quizRepository.createQuiz(quiz);
  return result;
}

export async function deleteCourseById(_id: string) {
  idSchema.parse({ _id });
  const result = await quizRepository.deleteQuizById(_id);
  if (!result) {
    throw new ObjectNotFound("Quiz");
  }
  return result;
}

export async function getAllQuizzes(courseId: string) {
  courseIdSchema.parse({ courseId });
  const result = await quizRepository.getAllQuizzes(courseId);
  return result;
}

export async function getQuizById(_id: string) {
  idSchema.parse({ _id });
  const result = await quizRepository.getQuizById(_id);
  if (result == null) {
    throw new ObjectNotFound("Quiz");
  }
  delete result.instructorId;
  return result;
}

export async function updateQuizById(_id: string, data: Partial<Quiz>) {
  idSchema.parse({ _id });
  const updateQuizFields = ["title", "description"] as const;
  const safeData: Partial<Quiz> = {};
  for (let field of updateQuizFields) {
    if (data[field] != null) {
      safeData[field] = data[field];
    }
  }
  if (data.questionIds != null) {
    safeData.questionIds = data.questionIds;
  }
  if (data.startDate != null) {
    safeData.startDate = new Date(data.startDate);
  }
  if (data.endDate != null) {
    safeData.endDate = new Date(data.endDate);
  }

  if (Object.keys(safeData).length === 0) {
    throw new BadRequest("At least one field must be provided to update quiz");
  }

  const oldQuiz = await getQuizById(_id);
  if (data.startDate == null) {
    data.startDate = oldQuiz?.startDate;
  }
  if (data.endDate == null) {
    data.endDate = oldQuiz?.endDate;
  }

  updateQuizSchema.parse(data);

  const course = await getPartialCourseById(oldQuiz.courseId.toString());

  await assertValidTimeAndDuration(course, oldQuiz, "Quiz");

  if (data.questionIds != null) {
    await assertQuestionsExist(safeData.questionIds!);
    safeData.questionIds = convertQuestionsToObjectId(safeData.questionIds!);
  }
  const result = await quizRepository.updateQuizById(_id, safeData);

  if (!result) {
    throw new ObjectNotFound("Quiz");
  }
  return result;
}
