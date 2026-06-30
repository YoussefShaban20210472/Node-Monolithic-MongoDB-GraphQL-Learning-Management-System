import { assertInstructorCreatorByQuiz } from "../../auth/assertInstructorCreator.auth.js";
import { assertStudentEnrolledByQuiz } from "../../auth/assertStudentEnrolled.auth.js";
import {
  createQuizAttemptByAdmin,
  createQuizAttemptByStudent,
  getAllQuizAttempts,
  getQuizAttempt,
  getQuizAttemptByStudent,
} from "../../controller/quizAttempt.controller.js";
import { assertStudentId } from "../../middleware/assertStudentId.middleware.js";
import { withAuthorization } from "../auth/withAuthorization.auth.graphql.js";

import { withRole } from "../auth/withRole.auth.graphql.js";
import { errorHandler } from "../error/errorHandler.error.graphql.js";
import { withMiddleware } from "../middleware/withMiddleware.middleware.graphql.js";

export const quizAttemptResolver = {
  Query: {
    quizAttemptByStudent: errorHandler(
      withAuthorization(withRole(getQuizAttemptByStudent, ["STUDENT"]), [
        assertStudentEnrolledByQuiz,
      ]),
    ),
    quizAttempt: errorHandler(
      withAuthorization(
        withMiddleware(withRole(getQuizAttempt, ["ADMIN", "INSTRUCTOR"]), [
          assertStudentId,
        ]),
        [assertInstructorCreatorByQuiz],
      ),
    ),
    quizAttempts: errorHandler(
      withAuthorization(withRole(getAllQuizAttempts, ["ADMIN", "INSTRUCTOR"]), [
        assertInstructorCreatorByQuiz,
      ]),
    ),
  },

  Mutation: {
    createQuizAttemptByStudent: errorHandler(
      withAuthorization(withRole(createQuizAttemptByStudent, ["STUDENT"]), [
        assertStudentEnrolledByQuiz,
      ]),
    ),
    createQuizAttemptByAdmin: errorHandler(
      withMiddleware(withRole(createQuizAttemptByAdmin, ["ADMIN"]), [
        assertStudentId,
      ]),
    ),
  },
};
