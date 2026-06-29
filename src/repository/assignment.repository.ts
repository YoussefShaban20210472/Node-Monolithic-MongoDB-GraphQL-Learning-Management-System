import {
  ClientSession,
  Collection,
  Filter,
  ObjectId,
  OptionalId,
  WithId,
} from "mongodb";
import { connect } from "../mongodb/mongodb.js";
import { Assignment } from "../model/assignment.model.js";

export async function createAssignment(
  assignment: Assignment,
): Promise<Assignment> {
  const db = await connect();
  const now = new Date();
  let collection: Collection<Assignment> =
    db.collection<Assignment>("assignments");
  const result = await collection.insertOne({
    title: String(assignment.title),
    description: String(assignment.description),
    score: assignment.score,
    instructorId: new ObjectId(assignment.instructorId),
    courseId: new ObjectId(assignment.courseId),
    startDate: new Date(assignment.startDate),
    endDate: new Date(assignment.endDate),
    createdAt: now,
    updatedAt: now,
  });

  return {
    title: String(assignment.title),
    description: String(assignment.description),
    score: assignment.score,
    courseId: assignment.courseId,
    startDate: assignment.startDate,
    endDate: assignment.endDate,
    createdAt: now,
    updatedAt: now,
    _id: result.insertedId,
  };
}

export async function deleteAssignmentById(_id: string): Promise<boolean> {
  const db = await connect();
  let collection = db.collection<Assignment>("assignments");
  const result = await collection.deleteOne({
    _id: new ObjectId(_id),
  });
  return result.deletedCount > 0;
}
export async function getAssignmentById(
  _id: string,
): Promise<Assignment | null> {
  const db = await connect();
  let collection = db.collection<Assignment>("assignments");
  const result = await collection.findOne({
    _id: new ObjectId(_id),
  });
  if (result == null) {
    return null;
  }
  return {
    ...result,
    startDate: new Date(result.startDate).toISOString(),
    endDate: new Date(result.endDate).toISOString(),
  };
}

export async function getAllAssignments(
  courseId: string,
): Promise<Assignment[]> {
  const db = await connect();
  let collection: Collection<Assignment> =
    db.collection<Assignment>("assignments");
  const result = await collection.find(
    { courseId: new ObjectId(courseId) },
    { projection: { otp: 0, instructorId: 0 } },
  );
  return result.toArray();
}

export async function updateAssignmentById(
  _id: string,
  data: Partial<Assignment>,
): Promise<Boolean> {
  const db = await connect();
  let collection: Collection<Assignment> =
    db.collection<Assignment>("assignments");
  const result = await collection.updateOne(
    { _id: new ObjectId(_id) },
    { $set: data },
  );
  return result.matchedCount > 0;
}
