import * as lessonService from "../service/lesson.service.js";

import {
  Context,
  CourseIdArgs,
  IdArgs,
} from "../graphql/interface/interface.graphql.js";
import {
  CourseGraphql,
  CreateCourseByAdminArgs,
  CreateCourseByInstructorArgs,
  UpdateCourseByIdArgs,
} from "../graphql/interface/course.interface.graphql.js";
import {
  CreateLessonArgs,
  CreateLessonInput,
  UpdateLessonByIdArgs,
} from "../graphql/interface/lesson.interface.graphql.js";
import { Lesson } from "../model/lesson.model.js";

export async function createLesson(
  _: unknown,
  args: CreateLessonArgs,
  context: Context,
  ___: unknown,
): Promise<Lesson> {
  const result = await lessonService.createLesson(args.input);
  return result;
}

export async function deleteLessonById(
  _: unknown,
  args: IdArgs,
  __: Context,
  ___: unknown,
): Promise<boolean> {
  const result = await lessonService.deleteCourseById(args.input._id);
  return result;
}

export async function getAllLessons(
  _: unknown,
  args: CourseIdArgs,
  __: Context,
  ___: unknown,
): Promise<Lesson[]> {
  const result = await lessonService.getAllLessons(args.input.courseId);
  return result;
}

export async function getLessonById(
  _: unknown,
  args: IdArgs,
  __: Context,
  ___: unknown,
): Promise<Lesson> {
  const result = await lessonService.getLessonById(args.input._id);
  return result;
}
export async function getLessonOTPById(
  _: unknown,
  args: IdArgs,
  __: Context,
  ___: unknown,
): Promise<string> {
  const result = await lessonService.getLessonOTPById(args.input._id);
  return result;
}

export async function updateLessonById(
  _: unknown,
  args: UpdateLessonByIdArgs,
  __: Context,
  ___: unknown,
): Promise<Boolean> {
  const _id = args.input._id;
  const result = await lessonService.updateLessonById(_id, args.input);
  return result;
}
