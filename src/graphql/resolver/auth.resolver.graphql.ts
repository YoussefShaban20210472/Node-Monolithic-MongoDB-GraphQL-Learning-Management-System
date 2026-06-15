import { login, logout } from "../../controller/auth.controller.js";
import { withRole } from "../auth/withRole.auth.graphql.js";
import { errorHandler } from "../error/errorHandler.error.graphql.js";

export const authResolver = {
  Query: {},

  Mutation: {
    login: errorHandler(login),
    logout: errorHandler(withRole(logout)),
  },
};
