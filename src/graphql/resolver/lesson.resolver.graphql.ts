import { assertCourseCreator } from "../../auth/assertCourseCreator.auth.js";
import { assertLessonCreator } from "../../auth/assertLessonCreator.auth.js";
import { assertStudentEnrolled } from "../../auth/assertStudentEnrolled.auth.js";
import {
  createCourseByAdmin,
  createCourseByInstructor,
  deleteCourseById,
  getAllCourses,
  getCourseById,
  updateCourseById,
} from "../../controller/course.controller.js";
import {
  createLesson,
  deleteLessonById,
  getAllLessons,
  getLessonById,
  getLessonOTPById,
  updateLessonById,
} from "../../controller/lesson.controller.js";
import { withAuthorization } from "../auth/withAuthorization.auth.graphql.js";
import { withRole } from "../auth/withRole.auth.graphql.js";
import { errorHandler } from "../error/errorHandler.error.graphql.js";

export const lessonResolver = {
  Query: {
    lesson: errorHandler(
      withAuthorization(withRole(getLessonById), [
        assertLessonCreator,
        assertStudentEnrolled,
      ]),
    ),
    lessonOTP: errorHandler(
      withAuthorization(withRole(getLessonOTPById, ["ADMIN", "INSTRUCTOR"]), [
        assertLessonCreator,
      ]),
    ),
    lessons: errorHandler(
      withAuthorization(withRole(getAllLessons), [
        assertCourseCreator,
        assertStudentEnrolled,
      ]),
    ),
  },

  Mutation: {
    createLesson: errorHandler(
      withAuthorization(withRole(createLesson, ["ADMIN", "INSTRUCTOR"]), [
        assertCourseCreator,
      ]),
    ),
    deleteLessonById: errorHandler(
      withAuthorization(withRole(deleteLessonById, ["ADMIN", "INSTRUCTOR"]), [
        assertLessonCreator,
      ]),
    ),
    updateLessonById: errorHandler(
      withAuthorization(withRole(updateLessonById, ["ADMIN", "INSTRUCTOR"]), [
        assertLessonCreator,
      ]),
    ),
  },
};
