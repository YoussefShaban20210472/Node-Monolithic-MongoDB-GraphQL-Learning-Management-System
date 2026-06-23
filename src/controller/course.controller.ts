import * as courseService from "../service/course.service.js";

import { Context, IdArgs } from "../graphql/interface/interface.graphql.js";
import {
  CourseGraphql,
  CreateCourseByAdminArgs,
  CreateCourseByInstructorArgs,
  UpdateCourseByIdArgs,
} from "../graphql/interface/course.interface.graphql.js";

export async function createCourseByInstructor(
  _: unknown,
  args: CreateCourseByInstructorArgs,
  context: Context,
  ___: unknown,
): Promise<CourseGraphql> {
  const instructorId = context.req.session.userId!;
  const result = await courseService.createCourse({
    ...args.input,
    instructorId,
  });
  return result;
}
export async function createCourseByAdmin(
  _: unknown,
  args: CreateCourseByAdminArgs,
  __: Context,
  ___: unknown,
): Promise<CourseGraphql> {
  const result = await courseService.createCourse(args.input);
  return result;
}

export async function deleteCourseById(
  _: unknown,
  args: IdArgs,
  __: Context,
  ___: unknown,
): Promise<boolean> {
  const result = await courseService.deleteCourseById(args.input._id);
  return result;
}

export async function getCourseById(
  _: unknown,
  args: IdArgs,
  __: Context,
  ___: unknown,
): Promise<CourseGraphql> {
  const result = await courseService.getCourseById(args.input._id);
  return result;
}
export async function getAllCourses(
  _: unknown,
  __: unknown,
  context: Context,
  ___: unknown,
): Promise<CourseGraphql[]> {
  const role = context.req.session.role!;
  const id = context.req.session.userId!;
  if (role === "INSTRUCTOR") {
    return await courseService.getCoursesByInstructorId(id);
  } else {
    return await courseService.getAllCourses();
  }
}

export async function updateCourseById(
  _: unknown,
  args: UpdateCourseByIdArgs,
  __: Context,
  ___: unknown,
): Promise<Boolean> {
  const _id = args.input._id;
  const result = await courseService.updateCourseById(_id, args.input);
  return result;
}
