import * as quizAttemptRepository from "../repository/quizAttempt.repository.js";

import { Confilct, ObjectNotFound } from "../error/business.error.js";
import { idSchema } from "../validator/validator.js";
import {
  getQuizAttemptSchema,
  quizAttemptSchema,
} from "../validator/quizAttempt.validator.js";
import { getPartialCourseById } from "./course.service.js";
import { getQuizById } from "./quiz.service.js";
import { getQuestionBankById } from "../repository/questionBank.repository.js";
import {
  CreateQuizAttemptInput,
  GetQuizAttemptInput,
} from "../graphql/interface/quizAttempt.interface.graphql.js";
import { quizIdSchema } from "../validator/quiz.validator.js";

export async function isInstructorIsQuizAttemptCreator(
  instructorId: string,
  quizAttempt: GetQuizAttemptInput,
) {
  const result = await quizAttemptRepository.getQuizAttempt(quizAttempt);
  if (result == null) {
    return false;
  }

  return result?.instructorId?.toString() === instructorId;
}
export async function calculateQuizScore(
  answers: { questionId: string; answer: string }[],
) {
  let score = 0;
  let table: any = {};
  for (let answer of answers) {
    if (table[answer.questionId]) {
      throw new Confilct("Can't send the same question twice");
    } else {
      table[answer.questionId] = true;
    }
  }
  for (let answer of answers) {
    const question = await getQuestionBankById(answer.questionId);
    if (question === null) {
      throw new ObjectNotFound("Question Id");
    }
    if (question.answer === answer.answer) {
      score += question.score;
    }
  }
  return score;
}
export async function createQuizAttempt(quizAttempt: CreateQuizAttemptInput) {
  quizAttemptSchema.parse(quizAttempt);
  const quiz = await getQuizById(quizAttempt.quizId.toString());
  const course = await getPartialCourseById(quiz.courseId.toString());
  const score = await calculateQuizScore(quizAttempt.answers);

  const result = await quizAttemptRepository.createQuizAttempt({
    instructorId: course?.instructorId,
    courseId: course?._id,
    studentId: quizAttempt.studentId,
    quizId: quizAttempt.quizId,
    score: score,
  });
  return result;
}

export async function getAllQuizAttempts(quizId: string) {
  quizIdSchema.parse({ quizId });
  const result = await quizAttemptRepository.getAllQuizAttempts(quizId);
  return result;
}

export async function getQuizAttempt(quizAttempt: GetQuizAttemptInput) {
  getQuizAttemptSchema.parse(quizAttempt);
  const result = await quizAttemptRepository.getQuizAttempt(quizAttempt);
  if (result == null) {
    throw new ObjectNotFound("Quiz Attempt");
  }
  delete result.instructorId;
  return result;
}
