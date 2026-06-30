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
import {
  assertInstructorCreatorByAssignment,
  assertInstructorCreatorByCourse,
} from "../../auth/assertInstructorCreator.auth.js";

export const assignmentResolver = {
  Query: {
    assignment: errorHandler(
      withAuthorization(withRole(getAssignmentById), [
        assertInstructorCreatorByAssignment,
        assertStudentEnrolledByAssignment,
      ]),
    ),
    assignments: errorHandler(
      withAuthorization(withRole(getAllAssignments), [
        assertInstructorCreatorByCourse,
        assertStudentEnrolledByCourse,
      ]),
    ),
  },

  Mutation: {
    createAssignment: errorHandler(
      withAuthorization(withRole(createAssignment, ["ADMIN", "INSTRUCTOR"]), [
        assertInstructorCreatorByCourse,
      ]),
    ),
    deleteAssignmentById: errorHandler(
      withAuthorization(
        withRole(deleteAssignmentById, ["ADMIN", "INSTRUCTOR"]),
        [assertInstructorCreatorByAssignment],
      ),
    ),
    updateAssignmentById: errorHandler(
      withAuthorization(
        withRole(updateAssignmentById, ["ADMIN", "INSTRUCTOR"]),
        [assertInstructorCreatorByAssignment],
      ),
    ),
  },
};
