import { Db } from "mongodb";

export async function up(db: Db): Promise<void> {
  await db.createCollection("assignments", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "title",
          "description",
          "score",
          "instructorId",
          "courseId",
          "startDate",
          "endDate",
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
          score: {
            bsonType: "int",
            minimum: 0,
            maximum: 100,
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
  await db.collection("assignments").drop();
}
