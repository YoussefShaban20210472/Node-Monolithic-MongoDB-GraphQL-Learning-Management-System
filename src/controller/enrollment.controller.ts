import * as enrollmentService from "../service/enrollment.service.js";

import { Context } from "../graphql/interface/interface.graphql.js";
import {
  EnrollmentArgs,
  UpdateEnrollmentArgs,
} from "../graphql/interface/enrollment.interface.graphql.js";

export async function enrollStudentByStudent(
  _: unknown,
  args: EnrollmentArgs,
  context: Context,
  __: unknown,
) {
  const _id = context.req.session.userId!;
  return await enrollmentService.enrollStudent({
    ...args.input,
    studentId: _id,
  });
}

export async function enrollStudentByAdmin(
  _: unknown,
  args: EnrollmentArgs,
  __: Context,
  ___: unknown,
) {
  return await enrollmentService.enrollStudent({
    ...args.input,
    studentId: args.input.studentId!,
  });
}

export async function getEnrollmentByStudent(
  _: unknown,
  args: EnrollmentArgs,
  context: Context,
  __: unknown,
) {
  const _id = context.req.session.userId!;
  return await enrollmentService.getEnrollment({
    ...args.input,
    studentId: _id,
  });
}

export async function getEnrollmentByAdmin(
  _: unknown,
  args: EnrollmentArgs,
  __: Context,
  ___: unknown,
) {
  return await enrollmentService.getEnrollment({
    ...args.input,
    studentId: args.input.studentId!,
  });
}

export async function deleteEnrollmentByStudent(
  _: unknown,
  args: EnrollmentArgs,
  context: Context,
  __: unknown,
) {
  const _id = context.req.session.userId!;
  return await enrollmentService.deleteEnrollment({
    ...args.input,
    studentId: _id,
  });
}

export async function deleteEnrollmentByAdmin(
  _: unknown,
  args: EnrollmentArgs,
  __: Context,
  ___: unknown,
) {
  return await enrollmentService.deleteEnrollment({
    ...args.input,
    studentId: args.input.studentId!,
  });
}
export async function updateEnrollment(
  _: unknown,
  args: UpdateEnrollmentArgs,
  __: Context,
  ___: unknown,
) {
  return await enrollmentService.updateEnrollment({
    ...args.input,
    studentId: args.input.studentId!,
  });
}
