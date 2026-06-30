import {
  assertInstructorCreatorByCourse,
  assertInstructorCreatorByLesson,
} from "../../auth/assertInstructorCreator.auth.js";
import {
  assertStudentEnrolledByCourse,
  assertStudentEnrolledByLesson,
} from "../../auth/assertStudentEnrolled.auth.js";

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
        assertInstructorCreatorByLesson,
        assertStudentEnrolledByLesson,
      ]),
    ),
    lessonOTP: errorHandler(
      withAuthorization(withRole(getLessonOTPById, ["ADMIN", "INSTRUCTOR"]), [
        assertInstructorCreatorByLesson,
      ]),
    ),
    lessons: errorHandler(
      withAuthorization(withRole(getAllLessons), [
        assertInstructorCreatorByCourse,
        assertStudentEnrolledByCourse,
      ]),
    ),
  },

  Mutation: {
    createLesson: errorHandler(
      withAuthorization(withRole(createLesson, ["ADMIN", "INSTRUCTOR"]), [
        assertInstructorCreatorByCourse,
      ]),
    ),
    deleteLessonById: errorHandler(
      withAuthorization(withRole(deleteLessonById, ["ADMIN", "INSTRUCTOR"]), [
        assertInstructorCreatorByLesson,
      ]),
    ),
    updateLessonById: errorHandler(
      withAuthorization(withRole(updateLessonById, ["ADMIN", "INSTRUCTOR"]), [
        assertInstructorCreatorByLesson,
      ]),
    ),
  },
};
