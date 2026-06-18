import { assertCourseCreator } from "../../auth/assertCourseCreator.auth.js";
import {
  createCourseByAdmin,
  createCourseByInstructor,
  deleteCourseById,
  getAllCourses,
  getCourseById,
  updateCourseById,
} from "../../controller/course.controller.js";
import { withAuthorization } from "../auth/withAuthorization.auth.graphql.js";
import { withRole } from "../auth/withRole.auth.graphql.js";
import { errorHandler } from "../error/errorHandler.error.graphql.js";

export const courseResolver = {
  Query: {
    course: errorHandler(
      withAuthorization(withRole(getCourseById), assertCourseCreator),
    ),
    courses: errorHandler(withRole(getAllCourses)),
  },

  Mutation: {
    createCourseByInstructor: errorHandler(
      withRole(createCourseByInstructor, ["INSTRUCTOR"]),
    ),
    createCourseByAdmin: errorHandler(withRole(createCourseByAdmin, ["ADMIN"])),
    deleteCourseById: errorHandler(
      withAuthorization(
        withRole(deleteCourseById, ["ADMIN", "INSTRUCTOR"]),
        assertCourseCreator,
      ),
    ),
    updateCourseById: errorHandler(
      withAuthorization(
        withRole(updateCourseById, ["ADMIN", "INSTRUCTOR"]),
        assertCourseCreator,
      ),
    ),
  },
};
