import * as attendanceService from "../service/attendance.service.js";

import { Context } from "../graphql/interface/interface.graphql.js";
import {
  AttendStudentByAdminArgs,
  AttendStudentByStudentArgs,
  GetAttendanceArgs,
} from "../graphql/interface/attendance.interface.graphql.js";
import { Attendance } from "../model/attendance.model.js";
import { LessonIdArgs } from "../graphql/interface/lesson.interface.graphql.js";

export async function attendStudentByStudent(
  _: unknown,
  args: AttendStudentByStudentArgs,
  context: Context,
  __: unknown,
): Promise<Attendance> {
  const studentId = context.req.session.userId!;
  const result = await attendanceService.attendStudent({
    ...args.input,
    studentId,
  });
  return result;
}
export async function attendStudentByAdmin(
  _: unknown,
  args: AttendStudentByAdminArgs,
  __: Context,
  ___: unknown,
): Promise<Attendance> {
  const result = await attendanceService.attendStudent(args.input);
  return result;
}

export async function getAttendanceByStudent(
  _: unknown,
  args: LessonIdArgs,
  context: Context,
  __: unknown,
): Promise<Attendance> {
  const studentId = context.req.session.userId!;
  const result = await attendanceService.getAttendance({
    ...args.input,
    studentId,
  });
  return result;
}
export async function getAttendance(
  _: unknown,
  args: GetAttendanceArgs,
  __: Context,
  ___: unknown,
): Promise<Attendance> {
  const result = await attendanceService.getAttendance(args.input);
  return result;
}

export async function getAllLessonAttendances(
  _: unknown,
  args: LessonIdArgs,
  context: Context,
  __: unknown,
): Promise<Attendance[]> {
  const result = await attendanceService.getAllLessonAttendances(args.input);
  return result;
}
