import {
  ClientSession,
  Collection,
  Filter,
  ObjectId,
  OptionalId,
} from "mongodb";
import { connect } from "../mongodb/mongodb.js";
import { Course, Topic } from "../model/course.model.js";
import { CourseGraphql } from "../graphql/interface/course.interface.graphql.js";

export async function addTopicsAndGetTheirIds(
  topics: string[],
  topicType: string,
): Promise<(string | ObjectId)[]> {
  const db = await connect();
  const ids = [];
  let collection = db.collection<Topic>(topicType);
  for (let topic of topics) {
    const result = await collection.insertOne({
      name: topic,
    });
    ids.push(result.insertedId);
  }
  return ids;
}
export async function createCourse(
  course: CourseGraphql,
  tags: string[],
  categories: string[],
): Promise<CourseGraphql> {
  const db = await connect();
  const now = new Date();

  const tagIds = await addTopicsAndGetTheirIds(tags, "tags");
  const categoryIds = await addTopicsAndGetTheirIds(categories, "categories");
  let collection: Collection<Course> = db.collection<Course>("courses");
  const result = await collection.insertOne({
    title: String(course.title),
    description: String(course.description),
    shortDescription: String(course.shortDescription),
    instructorId: new ObjectId(course.instructorId),
    startDate: new Date(course.startDate),
    endDate: new Date(course.endDate),
    tagIds,
    categoryIds,
    createdAt: now,
    updatedAt: now,
  });
  return {
    ...course,
    _id: result.insertedId,
  };
}
