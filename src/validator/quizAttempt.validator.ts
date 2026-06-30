import z from "zod";
import {
  getArrayMongoDbIdZObject,
  getMongoDbIdZObject,
  getStringZObject,
} from "./validator.js";

export const quizAttemptSchema = z.object({
  studentId: getMongoDbIdZObject("studentId"),
  quizId: getMongoDbIdZObject("quizId"),
  answers: z.array(
    z.object({
      questionId: getMongoDbIdZObject("questionId"),
      answer: getStringZObject("question answer", 1, 255),
    }),
    {
      error: (issue) =>
        issue.input === undefined
          ? "answers are required"
          : "answers must be array",
    },
  ),
});
export const getQuizAttemptSchema = z.object({
  studentId: getMongoDbIdZObject("studentId"),
  quizId: getMongoDbIdZObject("quizId"),
});
