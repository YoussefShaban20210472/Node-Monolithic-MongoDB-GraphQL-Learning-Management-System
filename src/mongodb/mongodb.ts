import config from "../config/index.js";
import { MongoClient, Db } from "mongodb";

let client: MongoClient;
let db: Db;

export async function connect(): Promise<Db> {
  if (db) {
    return db;
  }

  client = new MongoClient(config.db.url);

  await client.connect();

  db = client.db(config.db.dbName);

  console.log("MongoDB connected");

  return db;
}

export async function disconnect(): Promise<void> {
  if (client) {
    await client.close();
    console.log("MongoDB disconnected");
  }
}
