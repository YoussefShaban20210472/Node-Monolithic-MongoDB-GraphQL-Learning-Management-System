import { Collection, Filter, ObjectId, OptionalId } from "mongodb";
import User from "../model/user.model.js";
import { connect } from "../mongodb/mongodb.js";

export async function createUser(user: User): Promise<User> {
  const db = await connect();
  let collection: Collection<User> = db.collection<User>("users");
  const now = new Date();
  const result = await collection.insertOne({
    firstName: String(user.firstName),
    lastName: String(user.lastName),
    phoneNumber: String(user.phoneNumber),
    email: String(user.email),
    password: String(user.password),
    address: String(user.address),
    role: user.role,
    createdAt: now,
    updatedAt: now,
  });
  return {
    ...user,
    _id: result.insertedId,
  };
}
export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await connect();
  let collection: Collection<User> = db.collection<User>("users");
  const result = await collection.findOne({
    email,
  });
  return result;
}

export async function deleteUserById(_id: string): Promise<boolean> {
  const db = await connect();
  let collection: Collection<User> = db.collection<User>("users");
  const result = await collection.deleteOne({
    _id: new ObjectId(_id),
  });
  return result.deletedCount > 0;
}
export async function getUserById(_id: string): Promise<User | null> {
  const db = await connect();
  let collection: Collection<User> = db.collection<User>("users");
  const result = await collection.findOne({
    _id: new ObjectId(_id),
  });
  return result;
}
