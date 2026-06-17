import { Db } from "mongodb";

export async function up(db: Db): Promise<void> {
  await db.createCollection("courses", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "title",
          "description",
          "shortDescription",
          "instructorId",
          "startDate",
          "endDate",
          "tagIds",
          "categoryIds",
        ],
        properties: {
          title: {
            bsonType: "string",
            minLength: 5,
            maxLength: 255,
          },

          description: {
            bsonType: "string",
            minLength: 20,
          },

          shortDescription: {
            bsonType: "string",
            minLength: 20,
            maxLength: 500,
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

          tagIds: {
            bsonType: "array",
            minItems: 1,
            items: {
              bsonType: "objectId",
            },
          },

          categoryIds: {
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
  db.createCollection("tags", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["name"],
        properties: {
          name: {
            bsonType: "string",
            minLength: 2,
            maxLength: 100,
          },
        },
      },
    },
  });
  db.createCollection("categories", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["name"],
        properties: {
          name: {
            bsonType: "string",
            minLength: 2,
            maxLength: 100,
          },
        },
      },
    },
  });
  db.collection("tags").createIndex({ name: 1 }, { unique: true });
  db.collection("categories").createIndex({ name: 1 }, { unique: true });
}

export async function down(db: Db): Promise<void> {
  await db.collection("courses").drop();
  await db.collection("tags").drop();
  await db.collection("categories").drop();
}
