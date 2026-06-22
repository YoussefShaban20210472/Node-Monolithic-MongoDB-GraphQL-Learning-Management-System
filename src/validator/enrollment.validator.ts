import { z } from "zod";

import { getMongoDbIdZObject, getEnumZObject } from "./validator.js";
export const enrollmentSchema = z.object({
  studentId: getMongoDbIdZObject("studentId"),
  courseId: getMongoDbIdZObject("courseId"),
});
export const updateEnrollmentSchema = z.object({
  studentId: getMongoDbIdZObject("studentId"),
  courseId: getMongoDbIdZObject("courseId"),
  status: getEnumZObject("status", ["ACCEPTED", "REJECTED"]),
});
