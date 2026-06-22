import { ObjectId } from "mongodb";

export default interface Enrollment {
  _id?: ObjectId | string;
  studentId: ObjectId | string;
  courseId: ObjectId | string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
