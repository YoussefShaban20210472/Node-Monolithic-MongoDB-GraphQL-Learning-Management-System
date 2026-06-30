import {
  assertInstructorCreatorByCourse,
  assertInstructorCreatorByQuiz,
} from "../../auth/assertInstructorCreator.auth.js";
import {
  assertStudentEnrolledByCourse,
  assertStudentEnrolledByQuiz,
} from "../../auth/assertStudentEnrolled.auth.js";
import {
  createQuiz,
  deleteQuizById,
  getAllQuizzes,
  getQuizById,
  updateQuizById,
} from "../../controller/quiz.controller.js";
import { withAuthorization } from "../auth/withAuthorization.auth.graphql.js";
import { withRole } from "../auth/withRole.auth.graphql.js";
import { errorHandler } from "../error/errorHandler.error.graphql.js";

export const quizResolver = {
  Query: {
    quiz: errorHandler(
      withAuthorization(withRole(getQuizById), [
        assertInstructorCreatorByQuiz,
        assertStudentEnrolledByQuiz,
      ]),
    ),
    quizzes: errorHandler(
      withAuthorization(withRole(getAllQuizzes), [
        assertInstructorCreatorByCourse,
        assertStudentEnrolledByCourse,
      ]),
    ),
  },

  Mutation: {
    createQuiz: errorHandler(
      withAuthorization(withRole(createQuiz, ["ADMIN", "INSTRUCTOR"]), [
        assertInstructorCreatorByCourse,
      ]),
    ),
    deleteQuizById: errorHandler(
      withAuthorization(withRole(deleteQuizById, ["ADMIN", "INSTRUCTOR"]), [
        assertInstructorCreatorByQuiz,
      ]),
    ),
    updateQuizById: errorHandler(
      withAuthorization(withRole(updateQuizById, ["ADMIN", "INSTRUCTOR"]), [
        assertInstructorCreatorByQuiz,
      ]),
    ),
  },
};
