import { assertInstructorCreatorByLesson } from "../../auth/assertInstructorCreator.auth.js";
import { assertStudentEnrolledByLesson } from "../../auth/assertStudentEnrolled.auth.js";
import {
  attendStudentByAdmin,
  attendStudentByStudent,
  getAllLessonAttendances,
  getAttendance,
  getAttendanceByStudent,
} from "../../controller/attendance.controller.js";
import { assertStudentId } from "../../middleware/assertStudentId.middleware.js";
import { withAuthorization } from "../auth/withAuthorization.auth.graphql.js";
import { withRole } from "../auth/withRole.auth.graphql.js";
import { errorHandler } from "../error/errorHandler.error.graphql.js";
import { withMiddleware } from "../middleware/withMiddleware.middleware.graphql.js";

export const attendanceResolver = {
  Query: {
    attendanceByStudent: errorHandler(
      withAuthorization(withRole(getAttendanceByStudent, ["STUDENT"]), [
        assertStudentEnrolledByLesson,
      ]),
    ),
    attendance: errorHandler(
      withAuthorization(
        withMiddleware(withRole(getAttendance, ["ADMIN", "INSTRUCTOR"]), [
          assertStudentId,
        ]),
        [assertInstructorCreatorByLesson],
      ),
    ),
    lessonAttendances: errorHandler(
      withAuthorization(
        withMiddleware(
          withRole(getAllLessonAttendances, ["ADMIN", "INSTRUCTOR"]),
          [],
        ),
        [assertInstructorCreatorByLesson],
      ),
    ),
  },

  Mutation: {
    attendStudentByStudent: errorHandler(
      withAuthorization(withRole(attendStudentByStudent, ["STUDENT"]), [
        assertStudentEnrolledByLesson,
      ]),
    ),

    attendStudentByAdmin: errorHandler(
      withAuthorization(
        withMiddleware(withRole(attendStudentByAdmin, ["ADMIN"]), [
          assertStudentId,
        ]),
        [],
      ),
    ),
  },
};
