import { ObjectId } from "mongodb";

export interface Attendance {
  _id?: ObjectId | string;
  studentId: ObjectId | string;
  lessonId: ObjectId | string;
  attendedAt?: Date | string;
}
