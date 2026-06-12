import { login, logout } from "../../controller/auth.controller.js";
import { withRole } from "../auth/withRole.auth.graphql.js";

export const authResolver = {
  Query: {},

  Mutation: {
    login: login,
    logout: withRole()(logout),
  },
};
