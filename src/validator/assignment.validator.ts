import { z } from "zod";
import {
  checkDuration,
  checkTimeNow,
  getDateZObject,
  getMongoDbIdZObject,
  getNumberZObject,
  getStringZObject,
} from "./validator.js";

export const assignmentSchema = z
  .object({
    courseId: getMongoDbIdZObject("courseId"),
    title: getStringZObject("title", 5, 255),
    description: getStringZObject("description", 20, 99999999999),
    score: getNumberZObject("score", 0, 100),
    startDate: getDateZObject("startDate").refine(checkTimeNow, {
      message: "startDate must be at least now",
    }),
    endDate: getDateZObject("endDate"),
  })
  .superRefine((data, ctx) => checkDuration(data, ctx, "minutes"));
export const updateAssignmentSchema = z
  .object({
    title: getStringZObject("title", 5, 255).optional(),
    description: getStringZObject("description", 20, 99999999999).optional(),
    score: getNumberZObject("score", 0, 100).optional(),
    startDate: getDateZObject("startDate")
      .refine(checkTimeNow, {
        message: "startDate must be at least now",
      })
      .optional(),
    endDate: getDateZObject("endDate").optional(),
  })
  .superRefine((data, ctx) => checkDuration(data, ctx, "minutes"));

export const assignmentIdSchema = z.object({
  assignmentId: getMongoDbIdZObject("assignmentId"),
});
