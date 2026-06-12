import bcrypt from "bcrypt";
import User from "../model/user.model.js";
import * as userRepository from "../repository/user.repository.js";
import { userSchema, updateUserSchema } from "../validator/user.validator.js";
const saltRounds = 10;
export default class UserService {
  async createUser(user: User) {
    try {
      console.log("Service!");
      const _ = userSchema.parse(user);

      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      user.password = hashedPassword;

      const createdUser = await userRepository.createUser(user);
      return createdUser;
    } catch (e) {
      // console.log(e);
      throw e;
    }
  }
  async getUserByEmail(user: User) {
    try {
      const _ = userSchema.parse(user);

      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      user.password = hashedPassword;

      const createdUser = await userRepository.createUser(user);
      return createdUser;
    } catch (e) {
      // console.log(e);
      throw e;
    }
  }
}
