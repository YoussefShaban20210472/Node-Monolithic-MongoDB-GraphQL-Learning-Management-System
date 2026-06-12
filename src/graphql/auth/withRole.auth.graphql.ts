import { Context } from "../interface/interface.graphql.js";

export function withRole(role: string[] = ["STUDENT", "INSTRUCTOR", "ADMIN"]) {
  return function <TArgs, TResult>(
    resolver: (args: TArgs, context: Context) => Promise<TResult> | TResult,
  ) {
    return (_: unknown, args: TArgs, context: Context, __: unknown) => {
      const userId = context.req.session.userId;
      const userRole = context.req.session.role;

      if (!userId) {
        throw new Error("Unauthorized");
      }

      if (!role.includes(userRole!)) {
        throw new Error("Forbidden");
      }

      return resolver(args, context);
    };
  };
}
