import { Collection, ObjectId } from "mongodb";
import { connect } from "../mongodb/mongodb.js";

import Enrollment from "../model/enrollment.model.js";

export async function enrollStudent(
  enrollment: Enrollment,
): Promise<Enrollment> {
  const db = await connect();
  const now = new Date();

  let collection: Collection<Enrollment> =
    db.collection<Enrollment>("enrollments");
  const result = await collection.insertOne({
    studentId: new ObjectId(enrollment.studentId),
    courseId: new ObjectId(enrollment.courseId),
    status: "PENDING",
    createdAt: now,
    updatedAt: now,
  });
  return {
    ...enrollment,
    _id: result.insertedId,
    status: "PENDING",
  };
}
export async function deleteEnrollment(
  enrollment: Enrollment,
): Promise<Boolean> {
  const db = await connect();

  let collection: Collection<Enrollment> =
    db.collection<Enrollment>("enrollments");
  const result = await collection.deleteOne({
    studentId: new ObjectId(enrollment.studentId),
    courseId: new ObjectId(enrollment.courseId),
    status: "PENDING",
  });
  return result.deletedCount > 0;
}

export async function getEnrollment(
  enrollment: Enrollment,
): Promise<Enrollment | null> {
  const db = await connect();

  let collection: Collection<Enrollment> =
    db.collection<Enrollment>("enrollments");
  const result = await collection.findOne({
    studentId: new ObjectId(enrollment.studentId),
    courseId: new ObjectId(enrollment.courseId),
  });
  return result;
}

export async function updateEnrollment(
  enrollment: Enrollment,
): Promise<Boolean> {
  const db = await connect();

  let collection: Collection<Enrollment> =
    db.collection<Enrollment>("enrollments");
  const result = await collection.updateOne(
    {
      studentId: new ObjectId(enrollment.studentId),
      courseId: new ObjectId(enrollment.courseId),
    },
    { $set: { status: enrollment.status } },
  );
  return result.matchedCount > 0;
}
