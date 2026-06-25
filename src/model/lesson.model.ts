import { ObjectId } from "mongodb";

export interface Lesson {
  _id?: ObjectId | string;
  instructorId?: ObjectId | string;
  courseId: ObjectId | string;
  title: string;
  description: string;
  otp?: string;
  startDate: Date | string;
  endDate: Date | string;
  createdAt?: Date;
  updatedAt?: Date;
}
