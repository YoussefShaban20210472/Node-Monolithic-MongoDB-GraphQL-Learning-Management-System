import bcrypt from "bcrypt";
import User from "../model/user.model.js";
import * as userRepository from "../repository/user.repository.js";
import authSchema from "../validator/auth.validator.js";
export default class AuthService {
  async login(email: string, password: string): Promise<User> {
    try {
      const _ = authSchema.parse({ email, password });

      const user = await userRepository.getUserByEmail(email);
      if (!user) throw new Error("User Not Found");
      console.log(user);
      const valid = await bcrypt.compare(password, user.password);

      if (!valid) throw new Error("Invalid credentials");
      return user;
    } catch (e) {
      throw e;
    }
  }
  
}
