import { z } from "zod";
import {
  checkDuration,
  checkTimeNow,
  getDateZObject,
  getMongoDbIdZObject,
  getStringZObject,
} from "./validator.js";

export const lessonSchema = z
  .object({
    courseId: getMongoDbIdZObject("courseId"),
    title: getStringZObject("title", 5, 255),
    description: getStringZObject("description", 20, 99999999999),
    startDate: getDateZObject("startDate").refine(checkTimeNow, {
      message: "startDate must be at least now",
    }),
    endDate: getDateZObject("endDate"),
  })
  .superRefine((data, ctx) => checkDuration(data, ctx, "minutes"));
export const updateLessonSchema = z
  .object({
    title: getStringZObject("title", 5, 255).optional(),
    description: getStringZObject("description", 20, 99999999999).optional(),
    startDate: getDateZObject("startDate")
      .refine(checkTimeNow, {
        message: "startDate must be at least now",
      })
      .optional(),
    endDate: getDateZObject("endDate").optional(),
  })
  .superRefine((data, ctx) => checkDuration(data, ctx, "minutes"));

export const lessonIdSchema = z.object({
  lessonId: getMongoDbIdZObject("lessonId"),
});
