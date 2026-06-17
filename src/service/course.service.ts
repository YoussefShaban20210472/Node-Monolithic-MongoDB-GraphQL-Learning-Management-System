import User from "../model/user.model.js";
import * as courseRepository from "../repository/course.repository.js";

import { BadRequest, ObjectNotFound } from "../error/business.error.js";
import { courseSchema } from "../validator/course.validator.js";
import { CourseGraphql } from "../graphql/interface/course.interface.graphql.js";

export async function createCourse(course: CourseGraphql) {
  courseSchema.parse(course);

  const result = await courseRepository.createCourse(
    course,
    course.tags,
    course.categories,
  );
  return result;
}
