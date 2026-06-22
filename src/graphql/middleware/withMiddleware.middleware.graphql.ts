import { Unauthenticated, Unauthorized } from "../../error/business.error.js";
import { Context } from "../interface/interface.graphql.js";

export function withMiddleware<TArgs, TResult>(
  resolver: (
    _: unknown,
    args: TArgs,
    context: Context,
    __: unknown,
  ) => Promise<TResult> | TResult,
  middlewares: ((args: TArgs, context: Context) => Promise<void>)[],
) {
  return async (_: unknown, args: TArgs, context: Context, __: unknown) => {
    for (const middleware of middlewares) {
      await middleware(args, context);
    }
    return await resolver(_, args, context, __);
  };
}
