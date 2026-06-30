import { assertInstructorCreatorByCourse } from "../../auth/assertInstructorCreator.auth.js";
import {
  deleteEnrollmentByAdmin,
  deleteEnrollmentByStudent,
  enrollStudentByAdmin,
  enrollStudentByStudent,
  getEnrollmentByAdmin,
  getEnrollmentByStudent,
  updateEnrollment,
} from "../../controller/enrollment.controller.js";
import { assertStudentId } from "../../middleware/assertStudentId.middleware.js";
import { withAuthorization } from "../auth/withAuthorization.auth.graphql.js";
import { withRole } from "../auth/withRole.auth.graphql.js";
import { errorHandler } from "../error/errorHandler.error.graphql.js";
import { withMiddleware } from "../middleware/withMiddleware.middleware.graphql.js";

export const enrollmentResolver = {
  Query: {},

  Mutation: {
    enrollStudentByStudent: errorHandler(
      withRole(enrollStudentByStudent, ["STUDENT"]),
    ),
    enrollStudentByAdmin: errorHandler(
      withMiddleware(withRole(enrollStudentByAdmin, ["ADMIN"]), [
        assertStudentId,
      ]),
    ),
    getEnrollmentByStudent: errorHandler(
      withRole(getEnrollmentByStudent, ["STUDENT"]),
    ),
    getEnrollmentByAdmin: errorHandler(
      withMiddleware(withRole(getEnrollmentByAdmin, ["ADMIN"]), [
        assertStudentId,
      ]),
    ),
    deleteEnrollmentByStudent: errorHandler(
      withRole(deleteEnrollmentByStudent, ["STUDENT"]),
    ),
    deleteEnrollmentByAdmin: errorHandler(
      withMiddleware(withRole(deleteEnrollmentByAdmin, ["ADMIN"]), [
        assertStudentId,
      ]),
    ),
    confirmEnrollment: errorHandler(
      withAuthorization(
        withMiddleware(withRole(updateEnrollment, ["ADMIN", "INSTRUCTOR"]), [
          assertStudentId,
        ]),
        [assertInstructorCreatorByCourse],
      ),
    ),
  },
};
