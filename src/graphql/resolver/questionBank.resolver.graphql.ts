import { assertCourseCreator } from "../../auth/assertCourseCreator.auth.js";
import { assertQuestionBankCreator } from "../../auth/assertQuestionBankCreator.auth.js";
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
        assertQuestionBankCreator,
        assertStudentEnrolledByQuestionBank,
      ]),
    ),
    allQuestionBank: errorHandler(
      withAuthorization(withRole(getAllQuestionBank), [
        assertCourseCreator,
        assertStudentEnrolledByCourse,
      ]),
    ),
  },

  Mutation: {
    createQuestionBank: errorHandler(
      withAuthorization(withRole(createQuestionBank, ["ADMIN", "INSTRUCTOR"]), [
        assertCourseCreator,
      ]),
    ),
    deleteQuestionBankById: errorHandler(
      withAuthorization(
        withRole(deleteQuestionBankById, ["ADMIN", "INSTRUCTOR"]),
        [assertQuestionBankCreator],
      ),
    ),
    updateQuestionBankById: errorHandler(
      withAuthorization(
        withRole(updateQuestionBankById, ["ADMIN", "INSTRUCTOR"]),
        [assertQuestionBankCreator],
      ),
    ),
  },
};
