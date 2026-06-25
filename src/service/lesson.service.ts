import User from "../model/user.model.js";
import * as lessonRepository from "../repository/lesson.repository.js";

import { BadRequest, ObjectNotFound } from "../error/business.error.js";
import {
  courseSchema,
  updateCourseSchema,
} from "../validator/course.validator.js";
import { CourseGraphql } from "../graphql/interface/course.interface.graphql.js";
import {
  assertValidTimeAndDuration,
  courseIdSchema,
  idSchema,
} from "../validator/validator.js";
import { Course } from "../model/course.model.js";
import { lessonSchema } from "../validator/lesson.validator.js";
import { Lesson } from "../model/lesson.model.js";
import { generateOTP } from "../utils/otp.js";
import { getPartialCourseById } from "./course.service.js";

export async function isInstructorIsLessonCreator(
  instructorId: string,
  _id: string,
) {
  const lesson = await lessonRepository.getLessonById(_id);
  if (lesson == null) {
    return false;
  }

  return lesson?.instructorId?.toString() === instructorId;
}
export async function createLesson(lesson: Lesson) {
  lessonSchema.parse(lesson);
  const course = await getPartialCourseById(lesson.courseId.toString());

  await assertValidTimeAndDuration(course, lesson, "Lesson");
  lesson.instructorId = course?.instructorId;
  lesson.otp = generateOTP();
  const result = await lessonRepository.createLesson(lesson);
  return { ...result, otp: lesson.otp };
}

export async function deleteCourseById(_id: string) {
  idSchema.parse({ _id });
  const result = await lessonRepository.deleteLessonById(_id);
  if (!result) {
    throw new ObjectNotFound("Lesson");
  }
  return result;
}

export async function getAllLessons(courseId: string) {
  courseIdSchema.parse({ courseId });
  const result = await lessonRepository.getAllLessons(courseId);
  return result;
}

export async function getLessonById(_id: string) {
  idSchema.parse({ _id });
  const result = await lessonRepository.getLessonById(_id);
  if (result == null) {
    throw new ObjectNotFound("Lesson");
  }
  delete result.instructorId;
  return result;
}
export async function getLessonOTPById(_id: string) {
  idSchema.parse({ _id });
  const result = await lessonRepository.getLessonOTPById(_id);
  if (result == null) {
    throw new ObjectNotFound("Lesson");
  }
  return result;
}

export async function updateLessonById(_id: string, data: Partial<Lesson>) {
  idSchema.parse({ _id });
  const updateLessonFields = ["title", "description"] as const;
  const safeData: Partial<Lesson> = {};
  for (let field of updateLessonFields) {
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

  if (Object.keys(safeData).length === 0) {
    throw new BadRequest(
      "At least one field must be provided to update lesson",
    );
  }

  const oldLesson = await getLessonById(_id);
  if (data.startDate == null) {
    data.startDate = oldLesson?.startDate;
  }
  if (data.endDate == null) {
    data.endDate = oldLesson?.endDate;
  }

  updateCourseSchema.parse(data);
  const course = await getPartialCourseById(oldLesson.courseId.toString());

  await assertValidTimeAndDuration(course, oldLesson, "Lesson");

  const result = await lessonRepository.updateLessonById(_id, safeData);

  if (!result) {
    throw new ObjectNotFound("Lesson");
  }
  return result;
}
