import User from "../model/user.model.js";
import * as courseRepository from "../repository/course.repository.js";

import { BadRequest, ObjectNotFound } from "../error/business.error.js";
import {
  courseSchema,
  updateCourseSchema,
} from "../validator/course.validator.js";
import { CourseGraphql } from "../graphql/interface/course.interface.graphql.js";
import { idSchema } from "../validator/validator.js";
import { Course } from "../model/course.model.js";

export async function createCourse(course: CourseGraphql) {
  courseSchema.parse(course);

  const result = await courseRepository.createCourse(
    course,
    course.tags,
    course.categories,
  );
  return result;
}
export async function isInstructorIsCourseCreator(
  instructorId: string,
  _id: string,
) {
  const course = await courseRepository.getPartialCourseById(_id);
  if (course == null) {
    return false;
  }
  return course?.instructorId?.toString() == instructorId;
}

export async function deleteCourseById(_id: string) {
  idSchema.parse({ _id });
  const result = await courseRepository.deleteCourseById(_id);
  if (!result) {
    throw new ObjectNotFound("Course");
  }
  return result;
}

export async function getCourseById(_id: string) {
  idSchema.parse({ _id });
  const result = await courseRepository.getCourseById(_id);
  if (result == null) {
    throw new ObjectNotFound("Course");
  }
  return result;
}
export async function getPartialCourseById(_id: string) {
  idSchema.parse({ _id });
  const result = await courseRepository.getPartialCourseById(_id);
  if (result == null) {
    throw new ObjectNotFound("Course");
  }
  return result;
}

export async function getAllCourses() {
  const result = await courseRepository.getAllCourses();
  return result;
}
export async function getCoursesByInstructorId(instructorId: string) {
  const result = await courseRepository.getCoursesByInstructorId(instructorId);
  return result;
}

export async function updateCourseById(
  _id: string,
  data: Partial<CourseGraphql>,
) {
  idSchema.parse({ _id });
  const updateCourseFields = [
    "title",
    "description",
    "shortDescription",
  ] as const;
  const tags = data.tags;
  const categories = data.categories;
  const safeData: Partial<Course> = {};
  for (let field of updateCourseFields) {
    if (data[field] != null) {
      safeData[field] = data[field];
    }
  }
  if (data.startDate != null) {
    safeData.startDate = new Date(data.startDate);
  }
  if (data.endDate != null) {
    safeData.endDate = new Date(data.endDate);
  }

  if (
    Object.keys(safeData).length === 0 &&
    tags == null &&
    categories == null
  ) {
    throw new BadRequest(
      "At least one field must be provided to update course",
    );
  }

  const oldCourse = await courseRepository.getPartialCourseById(_id);
  if (data.startDate == null) {
    data.startDate = oldCourse?.startDate;
  }
  if (data.endDate == null) {
    data.endDate = oldCourse?.endDate;
  }

  updateCourseSchema.parse(data);

  const result = await courseRepository.updateCourseById(
    _id,
    safeData,
    tags,
    categories,
  );
  if (!result) {
    throw new ObjectNotFound("Course");
  }
  return result;
}
