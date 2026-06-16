import { GraphQLError } from "graphql";
import { handleAppError } from "../../error/app.error.js";
import { Context } from "../interface/interface.graphql.js";

export function errorHandler<TArgs, TResult>(
  resolver: (
    _: unknown,
    args: TArgs,
    context: Context,
    __: unknown,
  ) => Promise<TResult> | TResult,
) {
  return async (_: unknown, args: TArgs, context: Context, __: unknown) => {
    try {
      return await resolver(_, args, context, __);
    } catch (error: unknown) {
      throw new GraphQLError(handleAppError(error));
    }
  };
}
