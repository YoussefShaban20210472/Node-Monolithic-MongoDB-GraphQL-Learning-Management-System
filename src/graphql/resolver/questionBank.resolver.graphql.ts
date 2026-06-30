import {
  assertInstructorCreatorByCourse,
  assertInstructorCreatorByQuestionBank,
} from "../../auth/assertInstructorCreator.auth.js";
import {
  assertStudentEnrolledByCourse,
  assertStudentEnrolledByQuestionBank,
} from "../../auth/assertStudentEnrolled.auth.js";

import {
  createQuestionBank,
  deleteQuestionBankById,
  getAllQuestionBank,
  getQuestionBankById,
  updateQuestionBankById,
} from "../../controller/questionBank.controller.js";

import { withAuthorization } from "../auth/withAuthorization.auth.graphql.js";
import { withRole } from "../auth/withRole.auth.graphql.js";
import { errorHandler } from "../error/errorHandler.error.graphql.js";

export const questionBankResolver = {
  Query: {
    questionBank: errorHandler(
      withAuthorization(withRole(getQuestionBankById), [
        assertInstructorCreatorByQuestionBank,
        assertStudentEnrolledByQuestionBank,
      ]),
    ),
    allQuestionBank: errorHandler(
      withAuthorization(withRole(getAllQuestionBank), [
        assertInstructorCreatorByCourse,
        assertStudentEnrolledByCourse,
      ]),
    ),
  },

  Mutation: {
    createQuestionBank: errorHandler(
      withAuthorization(withRole(createQuestionBank, ["ADMIN", "INSTRUCTOR"]), [
        assertInstructorCreatorByCourse,
      ]),
    ),
    deleteQuestionBankById: errorHandler(
      withAuthorization(
        withRole(deleteQuestionBankById, ["ADMIN", "INSTRUCTOR"]),
        [assertInstructorCreatorByQuestionBank],
      ),
    ),
    updateQuestionBankById: errorHandler(
      withAuthorization(
        withRole(updateQuestionBankById, ["ADMIN", "INSTRUCTOR"]),
        [assertInstructorCreatorByQuestionBank],
      ),
    ),
  },
};
