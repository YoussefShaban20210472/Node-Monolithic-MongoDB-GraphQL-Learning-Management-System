import { z } from "zod";

import {
  getStringZObject,
  getMongoDbIdZObject,
  checkDuration,
  checkTimeBetweenNowAndYear,
  getDateZObject,
  getArrayZObject,
} from "./validator.js";
export const courseSchema = z
  .object({
    instructorId: getMongoDbIdZObject("instructorId"),
    title: getStringZObject("title", 5, 255),
    description: getStringZObject("description", 20, 999999999),
    shortDescription: getStringZObject("shortDescription", 20, 500),
    startDate: getDateZObject("startDate").refine(checkTimeBetweenNowAndYear, {
      message: "startDate must be between now and one year from now",
    }),
    endDate: getDateZObject("endDate"),
    tags: getArrayZObject("tags", 1, 255),
    categories: getArrayZObject("categories", 1, 255),
  })
  .superRefine((data, ctx) => checkDuration(data, ctx, "days"));
export const updateCourseSchema = z
  .object({
    title: getStringZObject("title", 5, 255).optional(),
    description: getStringZObject("description", 20, 999999999).optional(),
    shortDescription: getStringZObject("shortDescription", 20, 500).optional(),
    startDate: getDateZObject("startDate")
      .refine(checkTimeBetweenNowAndYear, {
        message: "startDate must be between now and one year from now",
      })
      .optional(),
    endDate: getDateZObject("endDate").optional(),
    tags: getArrayZObject("tags", 1, 255).optional(),
    categories: getArrayZObject("categories", 1, 255).optional(),
  })
  .superRefine((data, ctx) => checkDuration(data, ctx, "days"));
