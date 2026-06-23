import * as userService from "../service/user.service.js";
import {
  CreateUserArgs,
  UpdateUserArgs,
} from "../graphql/interface/user.interface.graphql.js";
import { Context, IdArgs } from "../graphql/interface/interface.graphql.js";
import User from "../model/user.model.js";

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
  args: IdArgs,
  __: Context,
  ___: unknown,
): Promise<boolean> {
  const result = await userService.deleteUserById(args.input._id);
  return result;
}
export async function getUserById(
  _: unknown,
  args: IdArgs,
  __: Context,
  ___: unknown,
): Promise<User> {
  const result = await userService.getUserById(args.input._id);
  return result;
}
export async function getAllUsers(
  _: unknown,
  __: unknown,
  ___: Context,
  ____: unknown,
): Promise<User[]> {
  const result = await userService.getAllUsers();
  return result;
}

export async function deleteMe(
  _: unknown,
  __: unknown,
  context: Context,
  ___: unknown,
): Promise<boolean> {
  const result = await userService.deleteUserById(context.req.session.userId!);
  return result;
}
export async function getMe(
  _: unknown,
  __: unknown,
  context: Context,
  ___: unknown,
): Promise<User> {
  const result = await userService.getUserById(context.req.session.userId!);
  return result;
}

export async function updateUserById(
  _: unknown,
  args: UpdateUserArgs,
  __: Context,
  ___: unknown,
): Promise<Boolean> {
  const _id = args.input._id!;
  delete args.input._id;
  const result = await userService.updateUserById(_id, args.input);
  return result;
}
export async function updateMe(
  _: unknown,
  args: UpdateUserArgs,
  context: Context,
  __: unknown,
): Promise<Boolean> {
  const result = await userService.updateUserById(
    context.req.session.userId!,
    args.input,
  );
  return result;
}
