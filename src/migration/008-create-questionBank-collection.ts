import { Db } from "mongodb";

export async function up(db: Db): Promise<void> {
  await db.createCollection("questionBank", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "courseId",
          "instructorId",
          "question",
          "answer",
          "score",
          "type",
          "choices",
          "createdAt",
          "updatedAt",
        ],
        properties: {
          courseId: {
            bsonType: "objectId",
          },
          instructorId: {
            bsonType: "objectId",
          },
          question: {
            bsonType: "string",
            minLength: 10,
          },
          answer: {
            bsonType: "string",
            minLength: 1,
          },
          score: {
            bsonType: "int",
            minimum: 0,
            maximum: 100,
          },
          type: {
            enum: ["MCQ", "TRUE_FALSE", "SHORT_ANSWER"],
          },
          choices: {
            bsonType: "array",
            items: {
              bsonType: "string",
              minLength: 1,
            },
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
}

export async function down(db: Db): Promise<void> {
  await db.collection("questionBank").drop();
}
