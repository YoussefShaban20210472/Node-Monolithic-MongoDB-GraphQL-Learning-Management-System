import {
  ClientSession,
  Collection,
  Filter,
  ObjectId,
  OptionalId,
  WithId,
} from "mongodb";
import { connect } from "../mongodb/mongodb.js";
import { Course, Topic } from "../model/course.model.js";
import { CourseGraphql } from "../graphql/interface/course.interface.graphql.js";

async function addTopicsAndGetTheirIds(
  topics: string[],
  topicType: string,
): Promise<(string | ObjectId)[]> {
  const db = await connect();
  const ids = [];
  let collection = db.collection<Topic>(topicType);
  for (let topic of topics) {
    let find = await collection.findOne({
      name: topic,
    });
    if (find == null) {
      const result = await collection.insertOne({
        name: topic,
      });
      ids.push(result.insertedId);
    } else {
      ids.push(find._id);
    }
  }
  return ids;
}
async function getTopicsNames(
  topicsIds: (string | ObjectId)[],
  topicType: string,
): Promise<string[]> {
  const db = await connect();
  const names = [];
  let collection = db.collection<Topic>(topicType);
  for (let topicId of topicsIds) {
    let find = await collection.findOne({
      _id: topicId,
    });
    names.push(find!.name);
  }
  return names;
}
async function getCourses(results: WithId<Course>[]) {
  const courses: CourseGraphql[] = [];
  for (const result of results) {
    const tags = await getTopicsNames(result.tagIds!, "tags");
    const categories = await getTopicsNames(result.categoryIds!, "categories");
    delete result.tagIds;
    delete result.categoryIds;
    courses.push({
      ...result,
      tags,
      categories,
      startDate: result.startDate.toISOString(),
      endDate: result.endDate.toISOString(),
    });
  }
  return courses;
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

export async function deleteCourseById(_id: string): Promise<boolean> {
  const db = await connect();
  let collection = db.collection<Course>("courses");
  const result = await collection.deleteOne({
    _id: new ObjectId(_id),
  });
  return result.deletedCount > 0;
}

export async function getCourseById(
  _id: string,
): Promise<CourseGraphql | null> {
  const db = await connect();
  let collection = db.collection<Course>("courses");
  const result = await collection.findOne({
    _id: new ObjectId(_id),
  });
  if (result == null) {
    return result;
  }
  const tags = await getTopicsNames(result.tagIds!, "tags");
  const categories = await getTopicsNames(result.categoryIds!, "categories");
  delete result.tagIds;
  delete result.categoryIds;
  return {
    ...result,
    tags,
    categories,
    startDate: result.startDate.toISOString(),
    endDate: result.endDate.toISOString(),
  };
}
export async function getPartialCourseById(
  _id: string,
): Promise<Partial<CourseGraphql> | null> {
  const db = await connect();
  let collection = db.collection<Course>("courses");
  const result = await collection.findOne({
    _id: new ObjectId(_id),
  });
  if (result == null) {
    return result;
  }
  delete result.tagIds;
  delete result.categoryIds;
  return {
    ...result,
    startDate: result.startDate.toISOString(),
    endDate: result.endDate.toISOString(),
  };
}
export async function getAllCourses(): Promise<CourseGraphql[]> {
  const db = await connect();
  let collection = db.collection<Course>("courses");
  const results = await collection.find().limit(10).toArray();
  return await getCourses(results);
}
export async function getCoursesByInstructorId(
  instructorId: string,
): Promise<CourseGraphql[]> {
  const db = await connect();
  let collection = db.collection<Course>("courses");
  const results = await collection
    .find({ instructorId: new ObjectId(instructorId) })
    .limit(10)
    .toArray();
  return await getCourses(results);
}

export async function updateCourseById(
  _id: string,
  data: Partial<Course>,
  tags?: string[],
  categories?: string[],
): Promise<Boolean> {
  const db = await connect();
  let collection = db.collection<Course>("courses");
  const find = await collection.findOne({ _id: new ObjectId(_id) });
  if (find == null) {
    return false;
  }
  if (tags != null) {
    data.tagIds = await addTopicsAndGetTheirIds(tags, "tags");
  }
  if (categories != null) {
    data.categoryIds = await addTopicsAndGetTheirIds(categories, "categories");
  }

  const result = await collection.updateOne(
    { _id: new ObjectId(_id) },
    { $set: { ...data } },
  );
  return result.matchedCount > 0;
}
