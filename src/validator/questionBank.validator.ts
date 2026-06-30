import { z } from "zod";
import {
  getArrayZObject,
  getEnumZObject,
  getMongoDbIdZObject,
  getNumberZObject,
  getStringZObject,
} from "./validator.js";

export const questionBankSchema = z
  .object({
    courseId: getMongoDbIdZObject("courseId"),
    question: getStringZObject("question", 10, 500),
    answer: getStringZObject("answer", 1, 255),
    score: getNumberZObject("score", 0, 100),
    type: getEnumZObject("type", ["MCQ", "TRUE_FALSE", "SHORT_ANSWER"]),
    choices: getArrayZObject("choices", 1, 255, 0, 5),
  })
  .superRefine((data, ctx) => {
    const type = data.type;
    const choices = data.choices;
    const answer = data.answer;

    if (type !== "MCQ" && type !== "TRUE_FALSE" && type !== "SHORT_ANSWER") {
      return;
    }
    if (!Array.isArray(choices)) {
      return;
    }
    if (
      choices.length > 0 &&
      (type == "TRUE_FALSE" || type == "SHORT_ANSWER")
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["choices"],
        message: "choices must be empty if question type is not mcq",
      });
    } else if (choices.length < 2 && type == "MCQ") {
      ctx.addIssue({
        code: "custom",
        path: ["choices"],
        message: "choices length must be at least 2 choices",
      });
    } else if (!choices.includes(answer) && type == "MCQ") {
      ctx.addIssue({
        code: "custom",
        path: ["choices"],
        message: "choices must contain the correct answer between the choices",
      });
    }
  });

export const updateQuestionBankSchema = z
  .object({
    question: getStringZObject("question", 10, 500).optional(),
    answer: getStringZObject("answer", 1, 255).optional(),
    score: getNumberZObject("score", 0, 100).optional(),
    type: getEnumZObject("type", [
      "MCQ",
      "TRUE_FALSE",
      "SHORT_ANSWER",
    ]).optional(),
    choices: getArrayZObject("choices", 1, 255, 0, 5).optional(),
  })
  .superRefine((data, ctx) => {
    const type = data.type;
    const choices = data.choices;
    const answer = data.answer;

    if (type !== "MCQ" && type !== "TRUE_FALSE" && type !== "SHORT_ANSWER") {
      return;
    }
    if (!Array.isArray(choices)) {
      return;
    }
    if (
      choices.length > 0 &&
      (type == "TRUE_FALSE" || type == "SHORT_ANSWER")
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["choices"],
        message: "choices must be empty if question type is not mcq",
      });
    } else if (choices.length < 2 && type == "MCQ") {
      ctx.addIssue({
        code: "custom",
        path: ["choices"],
        message: "choices length must be at least 2 choices",
      });
    } else if (!choices.includes(answer!) && type == "MCQ") {
      ctx.addIssue({
        code: "custom",
        path: ["choices"],
        message: "choices must contain the correct answer between the choices",
      });
    }
  });
