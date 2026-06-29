import { Db } from "mongodb";

export async function up(db: Db): Promise<void> {
  await db.createCollection("attendances", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["studentId", "lessonId", "attendedAt"],
        properties: {
          studentId: {
            bsonType: "objectId",
          },
          lessonId: {
            bsonType: "objectId",
          },
          attendedAt: {
            bsonType: "date",
          },
        },
      },
    },
  });
  await db
    .collection("attendances")
    .createIndex({ studentId: 1, lessonId: 1 }, { unique: true });
}

export async function down(db: Db): Promise<void> {
  await db.collection("attendances").drop();
}
