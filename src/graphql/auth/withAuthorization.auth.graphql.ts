import { Unauthenticated, Unauthorized } from "../../error/business.error.js";
import { Context } from "../interface/interface.graphql.js";

export function withAuthorization<TArgs, TResult>(
  resolver: (
    _: unknown,
    args: TArgs,
    context: Context,
    __: unknown,
  ) => Promise<TResult> | TResult,
  checkAuthoriation: (args: TArgs, context: Context) => Promise<void>,
) {
  return async (_: unknown, args: TArgs, context: Context, __: unknown) => {
    await checkAuthoriation(args, context);
    return await resolver(_, args, context, __);
  };
}
