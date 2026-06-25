import { Db } from "mongodb";

export async function up(db: Db): Promise<void> {
  await db.createCollection("lessons", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "title",
          "description",
          "otp",
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
          otp: {
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
  await db.collection("lessons").drop();
}
