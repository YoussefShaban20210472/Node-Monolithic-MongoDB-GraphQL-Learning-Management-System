import { MongoError } from "mongodb";
export function handleDbError(error: MongoError) {
  return error.message;
}
