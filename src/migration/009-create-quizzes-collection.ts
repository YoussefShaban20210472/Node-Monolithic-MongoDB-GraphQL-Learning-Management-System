import { Db } from "mongodb";

export async function up(db: Db): Promise<void> {
  await db.createCollection("quizzes", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "title",
          "description",
          "instructorId",
          "courseId",
          "startDate",
          "endDate",
          "questionIds",
          "createdAt",
          "updatedAt",
        ],
        properties: {
          title: {
            bsonType: "string",
            minLength: 5,
          },
          description: {
            bsonType: "string",
            minLength: 20,
          },
          courseId: {
            bsonType: "objectId",
          },
          instructorId: {
            bsonType: "objectId",
          },
          startDate: {
            bsonType: "date",
          },
          endDate: {
            bsonType: "date",
          },
          questionIds: {
            bsonType: "array",
            minItems: 1,
            items: {
              bsonType: "objectId",
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
  await db.collection("quizzes").drop();
}
