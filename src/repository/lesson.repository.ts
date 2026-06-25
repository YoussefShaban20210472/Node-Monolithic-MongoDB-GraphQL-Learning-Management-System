import {
  ClientSession,
  Collection,
  Filter,
  ObjectId,
  OptionalId,
  WithId,
} from "mongodb";
import { connect } from "../mongodb/mongodb.js";
import { Lesson } from "../model/lesson.model.js";

export async function createLesson(lesson: Lesson): Promise<Lesson> {
  const db = await connect();
  const now = new Date();
  let collection: Collection<Lesson> = db.collection<Lesson>("lessons");
  const result = await collection.insertOne({
    title: String(lesson.title),
    description: String(lesson.description),
    otp: String(lesson.otp),
    instructorId: new ObjectId(lesson.instructorId),
    courseId: new ObjectId(lesson.courseId),
    startDate: new Date(lesson.startDate),
    endDate: new Date(lesson.endDate),
    createdAt: now,
    updatedAt: now,
  });

  return {
    title: String(lesson.title),
    description: String(lesson.description),
    courseId: lesson.courseId,
    startDate: lesson.startDate,
    endDate: lesson.endDate,
    createdAt: now,
    updatedAt: now,
    _id: result.insertedId,
  };
}

export async function deleteLessonById(_id: string): Promise<boolean> {
  const db = await connect();
  let collection = db.collection<Lesson>("lessons");
  const result = await collection.deleteOne({
    _id: new ObjectId(_id),
  });
  return result.deletedCount > 0;
}
export async function getLessonById(_id: string): Promise<Lesson | null> {
  const db = await connect();
  let collection = db.collection<Lesson>("lessons");
  const result = await collection.findOne({
    _id: new ObjectId(_id),
  });
  if (result == null) {
    return null;
  }
  delete result.otp;
  return {
    ...result,
    startDate: new Date(result.startDate).toISOString(),
    endDate: new Date(result.endDate).toISOString(),
  };
}

export async function getLessonOTPById(_id: string): Promise<string | null> {
  const db = await connect();
  let collection = db.collection<Lesson>("lessons");
  const result = await collection.findOne({
    _id: new ObjectId(_id),
  });
  if (result == null) {
    return null;
  }
  return result.otp!;
}

export async function getAllLessons(courseId: string): Promise<Lesson[]> {
  const db = await connect();
  let collection: Collection<Lesson> = db.collection<Lesson>("lessons");
  const result = await collection.find(
    { courseId: new ObjectId(courseId) },
    { projection: { otp: 0, instructorId: 0 } },
  );
  return result.toArray();
}

export async function updateLessonById(
  _id: string,
  data: Partial<Lesson>,
): Promise<Boolean> {
  const db = await connect();
  let collection: Collection<Lesson> = db.collection<Lesson>("lessons");
  const result = await collection.updateOne(
    { _id: new ObjectId(_id) },
    { $set: data },
  );
  return result.matchedCount > 0;
}
