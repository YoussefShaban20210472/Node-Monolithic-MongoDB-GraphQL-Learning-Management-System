import { Collection, Filter, ObjectId, OptionalId } from "mongodb";
import User from "../model/user.model.js";
import { connect } from "../mongodb/mongodb.js";

export async function createUser(user: User): Promise<User> {
  try {
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
  } catch (e) {
    // console.log(e);
    throw e;
  }
}
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const db = await connect();
    let collection: Collection<User> = db.collection<User>("users");
    const result = await collection.findOne({
      email,
    });
    return result;
  } catch (e) {
    // console.log(e);
    throw e;
  }
}
