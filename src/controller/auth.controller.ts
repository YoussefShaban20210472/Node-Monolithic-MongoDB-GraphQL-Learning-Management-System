import AuthService from "../service/auth.service.js";
import { LoginArgs } from "../graphql/interface/auth.interface.graphql.js";
import { Context } from "../graphql/interface/interface.graphql.js";

const authService = new AuthService();

export async function login(
  _: unknown,
  args: LoginArgs,
  context: Context,
  __: unknown,
) {
  const user = await authService.login(args.input.email, args.input.password);
  context.req.session.userId = user._id!.toString();
  context.req.session.role = user.role;
  return user;
}

export async function logout(
  _: unknown,
  args: unknown,
  context: Context,
  ___: unknown,
): Promise<boolean> {
  await new Promise<void>((resolve, reject) => {
    context.req.session.destroy((err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });

  context.res.clearCookie("connect.sid");

  return true;
}
