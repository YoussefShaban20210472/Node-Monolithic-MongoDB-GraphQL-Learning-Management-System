import { z } from "zod";
import {
  checkDuration,
  checkTimeNow,
  getArrayMongoDbIdZObject,
  getDateZObject,
  getMongoDbIdZObject,
  getStringZObject,
} from "./validator.js";

export const quizSchema = z
  .object({
    courseId: getMongoDbIdZObject("courseId"),
    title: getStringZObject("title", 5, 255),
    description: getStringZObject("description", 20, 99999999999),
    startDate: getDateZObject("startDate").refine(checkTimeNow, {
      message: "startDate must be at least now",
    }),
    endDate: getDateZObject("endDate"),
    questionIds: getArrayMongoDbIdZObject("questionIds", 1, 10000),
  })
  .superRefine((data, ctx) => checkDuration(data, ctx, "minutes"));
export const updateQuizSchema = z
  .object({
    title: getStringZObject("title", 5, 255).optional(),
    description: getStringZObject("description", 20, 99999999999).optional(),
    startDate: getDateZObject("startDate")
      .refine(checkTimeNow, {
        message: "startDate must be at least now",
      })
      .optional(),
    endDate: getDateZObject("endDate").optional(),
    questionIds: getArrayMongoDbIdZObject("questionIds", 1, 10000).optional(),
  })
  .superRefine((data, ctx) => checkDuration(data, ctx, "minutes"));
