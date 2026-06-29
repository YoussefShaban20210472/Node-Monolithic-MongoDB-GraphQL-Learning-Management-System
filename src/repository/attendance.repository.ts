import {
  ClientSession,
  Collection,
  Filter,
  ObjectId,
  OptionalId,
  WithId,
} from "mongodb";
import { connect } from "../mongodb/mongodb.js";
import { Attendance } from "../model/attendance.model.js";

export async function attendStudent(
  attendance: Attendance,
): Promise<Attendance> {
  const db = await connect();
  const now = new Date();
  let collection: Collection<Attendance> =
    db.collection<Attendance>("attendances");
  const result = await collection.insertOne({
    studentId: new ObjectId(attendance.studentId),
    lessonId: new ObjectId(attendance.lessonId),
    attendedAt: now,
  });

  return {
    studentId: attendance.studentId,
    lessonId: attendance.lessonId,
    attendedAt: now.toISOString(),
    _id: result.insertedId,
  };
}
export async function getAttendance(
  attendance: Attendance,
): Promise<Attendance | null> {
  const db = await connect();
  let collection: Collection<Attendance> =
    db.collection<Attendance>("attendances");
  const result = await collection.findOne({
    studentId: new ObjectId(attendance.studentId),
    lessonId: new ObjectId(attendance.lessonId),
  });
  if (result === null) {
    return null;
  }
  return {
    studentId: attendance.studentId,
    lessonId: attendance.lessonId,
    attendedAt: new Date(result.attendedAt!).toISOString(),
    _id: result._id,
  };
}
export async function getAllLessonAttendances(
  lessonId: string,
): Promise<Attendance[]> {
  const db = await connect();
  let collection: Collection<Attendance> =
    db.collection<Attendance>("attendances");
  const result = await collection.find({
    lessonId: new ObjectId(lessonId),
  });
  return result.toArray();
}
