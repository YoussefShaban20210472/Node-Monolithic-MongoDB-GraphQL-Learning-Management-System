import bcrypt from "bcrypt";
import User from "../model/user.model.js";
import * as userRepository from "../repository/user.repository.js";
import {
  userSchema,
  updateUserSchema,
  userIdSchema,
} from "../validator/user.validator.js";
import { ObjectNotFound } from "../error/business.error.js";
const saltRounds = 10;
export default class UserService {
  async createUser(user: User) {
    const _ = userSchema.parse(user);

    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    user.password = hashedPassword;

    const createdUser = await userRepository.createUser(user);
    return createdUser;
  }

  async getUserByEmail(user: User) {
    const _ = userSchema.parse(user);

    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    user.password = hashedPassword;

    const createdUser = await userRepository.createUser(user);
    return createdUser;
  }
  async deleteUserById(_id: string) {
    userIdSchema.parse({ _id });
    const result = await userRepository.deleteUserById(_id);
    if (!result) {
      throw new ObjectNotFound("User");
    }
    return result;
  }
  async getUserById(_id: string) {
    userIdSchema.parse({ _id });
    const result = await userRepository.getUserById(_id);
    if (result == null) {
      throw new ObjectNotFound("User");
    }
    return result;
  }
}
