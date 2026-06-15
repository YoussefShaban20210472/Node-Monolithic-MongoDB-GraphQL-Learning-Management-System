export class RedisError extends Error {
  constructor(message: string) {
    super(message);
  }
}
export function handleRedisError(error: RedisError) {
  return error.message;
}
