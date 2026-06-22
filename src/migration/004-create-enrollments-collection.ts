import { Db } from "mongodb";

export async function up(db: Db): Promise<void> {
  await db.createCollection("enrollments", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["courseId", "studentId", "status"],
        properties: {
          courseId: {
            bsonType: "objectId",
          },
          studentId: {
            bsonType: "objectId",
          },
          status: {
            enum: ["PENDING", "ACCEPTED", "REJECTED"],
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
  await db
    .collection("enrollments")
    .createIndex({ courseId: 1, studentId: 1 }, { unique: true });
}

export async function down(db: Db): Promise<void> {
  await db.collection("enrollments").drop();
}
