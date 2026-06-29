import { ObjectId } from "mongodb";

export interface Assignment {
  _id?: ObjectId | string;
  instructorId?: ObjectId | string;
  courseId: ObjectId | string;
  title: string;
  description: string;
  score: number;
  startDate: Date | string;
  endDate: Date | string;
  createdAt?: Date;
  updatedAt?: Date;
}
