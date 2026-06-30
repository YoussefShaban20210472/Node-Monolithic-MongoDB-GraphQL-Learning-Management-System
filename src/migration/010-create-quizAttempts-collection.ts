import { Db } from "mongodb";

export async function up(db: Db): Promise<void> {
  await db.createCollection("quizAttempts", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "score",
          "instructorId",
          "courseId",
          "quizId",
          "studentId",
          "attemptedAt",
        ],
        properties: {
          score: {
            bsonType: "int",
            minimum: 0,
          },
          courseId: {
            bsonType: "objectId",
          },
          instructorId: {
            bsonType: "objectId",
          },
          quizId: {
            bsonType: "objectId",
          },
          studentId: {
            bsonType: "objectId",
          },
          startDate: {
            bsonType: "date",
          },
          endDate: {
            bsonType: "date",
          },
          attemptedAt: {
            bsonType: "date",
          },
        },
      },
    },
  });
  await db
    .collection("quizAttempts")
    .createIndex({ quizId: 1, studentId: 1 }, { unique: true });
}

export async function down(db: Db): Promise<void> {
  await db.collection("quizAttempts").drop();
}
