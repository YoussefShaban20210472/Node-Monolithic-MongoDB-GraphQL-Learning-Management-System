import { z } from "zod";
import { getMongoDbIdZObject, getStringZObject } from "./validator.js";

export const attendanceSchema = z.object({
  lessonId: getMongoDbIdZObject("lessonId"),
  studentId: getMongoDbIdZObject("studentId"),
  otp: getStringZObject("otp", 20, 255, `[0-9]`, "digits"),
});
export const getAttendanceSchema = z.object({
  lessonId: getMongoDbIdZObject("lessonId"),
  studentId: getMongoDbIdZObject("studentId"),
});
