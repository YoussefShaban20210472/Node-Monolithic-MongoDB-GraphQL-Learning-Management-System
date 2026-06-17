import {
  createCourseByAdmin,
  createCourseByInstructor,
} from "../../controller/course.controller.js";
import { withRole } from "../auth/withRole.auth.graphql.js";
import { errorHandler } from "../error/errorHandler.error.graphql.js";

export const courseResolver = {
  Query: {
    // user: errorHandler(withRole(getUserById, ["ADMIN"])),
    // users: errorHandler(withRole(getAllUsers, ["ADMIN"])),
    // me: errorHandler(withRole(getMe)),
  },

  Mutation: {
    createCourseByInstructor: errorHandler(
      withRole(createCourseByInstructor, ["INSTRUCTOR"]),
    ),
    createCourseByAdmin: errorHandler(withRole(createCourseByAdmin, ["ADMIN"])),
  },
};
