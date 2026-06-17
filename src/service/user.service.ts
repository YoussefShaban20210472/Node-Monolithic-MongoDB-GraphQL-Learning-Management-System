import bcrypt from "bcrypt";
import User from "../model/user.model.js";
import * as userRepository from "../repository/user.repository.js";
import { userSchema, updateUserSchema } from "../validator/user.validator.js";
import { BadRequest, ObjectNotFound } from "../error/business.error.js";
import { idSchema } from "../validator/validator.js";
const saltRounds = 10;
export default class UserService {
  async createUser(user: User) {
    userSchema.parse(user);

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
    idSchema.parse({ _id });
    const result = await userRepository.deleteUserById(_id);
    if (!result) {
      throw new ObjectNotFound("User");
    }
    return result;
  }
  async getUserById(_id: string) {
    idSchema.parse({ _id });
    const result = await userRepository.getUserById(_id);
    if (result == null) {
      throw new ObjectNotFound("User");
    }
    return result;
  }
  async getAllUsers() {
    const result = await userRepository.getAllUsers();
    return result;
  }
  async updateUserById(_id: string, data: Partial<User>) {
    idSchema.parse({ _id });
    updateUserSchema.parse(data);
    const updateUserFields = [
      "firstName",
      "lastName",
      "phoneNumber",
      "email",
      "address",
    ] as const;

    const safeData: Partial<User> = {};
    for (let field of updateUserFields) {
      if (data[field] != null) {
        safeData[field] = data[field];
      }
    }

    if (Object.keys(safeData).length === 0) {
      throw new BadRequest(
        "At least one field must be provided to update user",
      );
    }

    const result = await userRepository.updateUserById(_id, safeData);
    if (!result) {
      throw new ObjectNotFound("User");
    }
    return result;
  }
}
