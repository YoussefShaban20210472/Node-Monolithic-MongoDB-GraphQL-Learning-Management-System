import { assertCourseCreator } from "../../auth/assertCourseCreator.auth.js";
import { assertAssignmentCreator } from "../../auth/assertAssignmentCreator.auth.js";
import {
  createCourseByAdmin,
  createCourseByInstructor,
  deleteCourseById,
  getAllCourses,
  getCourseById,
  updateCourseById,
} from "../../controller/course.controller.js";
import {
  createAssignment,
  deleteAssignmentById,
  getAllAssignments,
  getAssignmentById,
  updateAssignmentById,
} from "../../controller/assignment.controller.js";
import { withAuthorization } from "../auth/withAuthorization.auth.graphql.js";
import { withRole } from "../auth/withRole.auth.graphql.js";
import { errorHandler } from "../error/errorHandler.error.graphql.js";
import {
  assertStudentEnrolledByAssignment,
  assertStudentEnrolledByCourse,
} from "../../auth/assertStudentEnrolled.auth.js";

export const assignmentResolver = {
  Query: {
    assignment: errorHandler(
      withAuthorization(withRole(getAssignmentById), [
        assertAssignmentCreator,
        assertStudentEnrolledByAssignment,
      ]),
    ),
    assignments: errorHandler(
      withAuthorization(withRole(getAllAssignments), [
        assertCourseCreator,
        assertStudentEnrolledByCourse,
      ]),
    ),
  },

  Mutation: {
    createAssignment: errorHandler(
      withAuthorization(withRole(createAssignment, ["ADMIN", "INSTRUCTOR"]), [
        assertCourseCreator,
      ]),
    ),
    deleteAssignmentById: errorHandler(
      withAuthorization(
        withRole(deleteAssignmentById, ["ADMIN", "INSTRUCTOR"]),
        [assertAssignmentCreator],
      ),
    ),
    updateAssignmentById: errorHandler(
      withAuthorization(
        withRole(updateAssignmentById, ["ADMIN", "INSTRUCTOR"]),
        [assertAssignmentCreator],
      ),
    ),
  },
};
