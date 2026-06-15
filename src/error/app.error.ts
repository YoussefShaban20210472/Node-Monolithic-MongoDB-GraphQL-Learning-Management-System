import { handleZodError } from "./zod.error.js";
import { handleRedisError, RedisError } from "./redis.error.js";
import { handleDbError } from "./db.error.js";
import { BusinessError, handleBusinessError } from "./business.error.js";
import { ZodError } from "zod";
import { MongoError } from "mongodb";

export function handleAppError(error: unknown): string {
  if (error instanceof ZodError) {
    return handleZodError(error);
  } else if (error instanceof MongoError) {
    return handleDbError(error);
  } else if (error instanceof RedisError) {
    return handleBusinessError(error);
  } else if (error instanceof Error) {
    return handleRedisError(error);
  } else {
    return "Internal server error";
  }
}
