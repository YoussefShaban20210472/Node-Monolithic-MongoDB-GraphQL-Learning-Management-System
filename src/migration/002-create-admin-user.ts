import { Db } from "mongodb";
import config from "../config/index.js";

export async function up(db: Db): Promise<void> {
  const adminExists = await db.collection("users").findOne({
    email: config.admin.email,
  });

  if (!adminExists) {
    await db.collection("users").insertOne(config.admin);
  }
}

export async function down(db: Db): Promise<void> {
  await db.collection("users").deleteOne({ email: config.admin.email });
}
