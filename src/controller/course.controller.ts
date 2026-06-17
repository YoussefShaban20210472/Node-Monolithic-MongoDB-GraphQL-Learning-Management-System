import * as courseService from "../service/course.service.js";

import { Context } from "../graphql/interface/interface.graphql.js";
import {
  CourseGraphql,
  CreateCourseByAdminArgs,
  CreateCourseByInstructorArgs,
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
  context: Context,
  ___: unknown,
): Promise<CourseGraphql> {
  const result = await courseService.createCourse(args.input);
  return result;
}
