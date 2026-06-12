import UserService from "../service/user.service.js";
import {
  roleMap,
  CreateUserArgs,
} from "../graphql/interface/user.interface.graphql.js";
import { Context } from "../graphql/interface/interface.graphql.js";
import User from "../model/user.model.js";

const userService = new UserService();

export async function createUser(
  args: CreateUserArgs,
  _: Context,
): Promise<User> {
  const user = await userService.createUser({
    ...args.input,
    role: roleMap[args.input.role],
  });
  return user;
}
