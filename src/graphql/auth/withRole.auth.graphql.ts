import { Unauthenticated, Unauthorized } from "../../error/business.error.js";
import { Context } from "../interface/interface.graphql.js";

export function withRole<TArgs, TResult>(
  resolver: (
    _: unknown,
    args: TArgs,
    context: Context,
    __: unknown,
  ) => Promise<TResult> | TResult,
  role: string[] = ["STUDENT", "INSTRUCTOR", "ADMIN"],
) {
  return async (_: unknown, args: TArgs, context: Context, __: unknown) => {
    const userId = context.req.session.userId;
    const userRole = context.req.session.role;

    if (!userId) {
      throw new Unauthenticated();
    }

    if (!role.includes(userRole!)) {
      throw new Unauthorized();
    }
    return await resolver(_, args, context, __);
  };
}
