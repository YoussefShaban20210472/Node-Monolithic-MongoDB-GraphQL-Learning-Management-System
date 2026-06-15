import {
  createUser,
  deleteUserById,
} from "../../controller/user.controller.js";
import { withRole } from "../auth/withRole.auth.graphql.js";
import { errorHandler } from "../error/errorHandler.error.graphql.js";

export const userResolver = {
  Query: {
    // users: async () => {
    //   return [];
    // },
    // user: async ({ id }: { id: string }) => {
    //   return {
    //     id,
    //     firstName: "Youssef",
    //     lastName: "Shaban",
    //     phoneNumber: "01012345678",
    //     email: "youssef@example.com",
    //     address: "Cairo",
    //     role: "STUDENT",
    //     createdAt: new Date().toISOString(),
    //   };
    // },
  },

  Mutation: {
    createUser: errorHandler(withRole(createUser, ["ADMIN"])),
    deleteUserById: errorHandler(withRole(deleteUserById, ["ADMIN"])),
  },
};
