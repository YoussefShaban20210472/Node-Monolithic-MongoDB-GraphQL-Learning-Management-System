import { Db } from "mongodb";
import config from "../config/index.js";

const users = [config.instructor, config.student];
export async function up(db: Db): Promise<void> {
  for (let user of users) {
    const adminExists = await db.collection("users").findOne({
      email: user.email,
    });

    if (!adminExists) {
      await db.collection("users").insertOne(user);
    }
  }
}

export async function down(db: Db): Promise<void> {
  for (let user of users) {
    await db.collection("users").deleteOne({ email: user.email });
  }
}
