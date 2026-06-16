import {
  createUser,
  deleteMe,
  deleteUserById,
  getAllUsers,
  getMe,
  getUserById,
  updateMe,
  updateUserById,
} from "../../controller/user.controller.js";
import { withRole } from "../auth/withRole.auth.graphql.js";
import { errorHandler } from "../error/errorHandler.error.graphql.js";

export const userResolver = {
  Query: {
    user: errorHandler(withRole(getUserById, ["ADMIN"])),
    users: errorHandler(withRole(getAllUsers, ["ADMIN"])),
    me: errorHandler(withRole(getMe)),
  },

  Mutation: {
    createUser: errorHandler(withRole(createUser, ["ADMIN"])),
    deleteUserById: errorHandler(withRole(deleteUserById, ["ADMIN"])),
    deleteMe: errorHandler(withRole(deleteMe)),
    updateUserById: errorHandler(withRole(updateUserById, ["ADMIN"])),
    updateMe: errorHandler(withRole(updateMe)),
  },
};
