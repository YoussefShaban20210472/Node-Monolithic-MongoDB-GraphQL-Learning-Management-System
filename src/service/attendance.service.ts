import User from "../model/user.model.js";
import * as attendanceRepository from "../repository/attendance.repository.js";

import { BadRequest, ObjectNotFound } from "../error/business.error.js";

import { lessonIdSchema, lessonSchema } from "../validator/lesson.validator.js";

import { AttendanceInput } from "../graphql/interface/attendance.interface.graphql.js";
import {
  attendanceSchema,
  getAttendanceSchema,
} from "../validator/attendance.validator.js";
import { getLessonOTPById } from "./lesson.service.js";
import { Attendance } from "../model/attendance.model.js";
import { LessonIdInput } from "../graphql/interface/lesson.interface.graphql.js";

export async function attendStudent(attendance: AttendanceInput) {
  attendanceSchema.parse(attendance);
  const lessonOTP = await getLessonOTPById(attendance.lessonId);
  if (lessonOTP !== attendance.otp) {
    throw new BadRequest("OTP is wrong");
  }
  const result = await attendanceRepository.attendStudent({
    studentId: attendance.studentId,
    lessonId: attendance.lessonId,
  });
  return result;
}
export async function getAttendance(attendance: Attendance) {
  getAttendanceSchema.parse(attendance);

  const result = await attendanceRepository.getAttendance(attendance);
  if (result === null) {
    throw new ObjectNotFound("Attendance");
  }
  return result;
}

export async function getAllLessonAttendances(attendance: LessonIdInput) {
  lessonIdSchema.parse(attendance);

  const result = await attendanceRepository.getAllLessonAttendances(
    attendance.lessonId,
  );
  return result;
}
