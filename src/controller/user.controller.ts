import UserService from "../service/user.service.js";
import {
  CreateUserArgs,
  deleteUserByIdArgs,
} from "../graphql/interface/user.interface.graphql.js";
import { Context } from "../graphql/interface/interface.graphql.js";
import User from "../model/user.model.js";

const userService = new UserService();

export async function createUser(
  _: unknown,
  args: CreateUserArgs,
  __: Context,
  ___: unknown,
): Promise<User> {
  const user = await userService.createUser(args.input);
  return user;
}
export async function deleteUserById(
  _: unknown,
  args: deleteUserByIdArgs,
  __: Context,
  ___: unknown,
): Promise<boolean> {
  const result = await userService.deleteUserById(args._id);
  return result;
}
