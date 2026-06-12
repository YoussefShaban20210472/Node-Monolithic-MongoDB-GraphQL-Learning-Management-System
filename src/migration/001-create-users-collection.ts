import { Db } from "mongodb";

export async function up(db: Db): Promise<void> {
  await db.createCollection("users", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "firstName",
          "lastName",
          "phoneNumber",
          "email",
          "password",
          "role",
        ],
        properties: {
          firstName: {
            bsonType: "string",
            minLength: 2,
          },
          lastName: {
            bsonType: "string",
            minLength: 2,
          },
          phoneNumber: {
            bsonType: "string",
            pattern: "^[0-9]{10,15}$",
          },
          email: {
            bsonType: "string",
            pattern: "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
          },
          password: {
            bsonType: "string",
            minLength: 8,
          },
          address: {
            bsonType: "string",
          },
          role: {
            enum: ["STUDENT", "INSTRUCTOR", "ADMIN"],
          },
          createdAt: {
            bsonType: "date",
          },
          updatedAt: {
            bsonType: "date",
          },
        },
      },
    },
  });
  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  await db
    .collection("users")
    .createIndex({ phoneNumber: 1 }, { unique: true });
}

export async function down(db: Db): Promise<void> {
  await db.collection("users").drop();
}
