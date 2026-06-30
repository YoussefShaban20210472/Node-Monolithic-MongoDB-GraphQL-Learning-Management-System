import { ObjectId } from "mongodb";

export interface Quiz {
  _id?: ObjectId | string;
  title: string;
  description: string;
  startDate: Date | string;
  endDate: Date | string;
  courseId: ObjectId | string;
  instructorId?: ObjectId | string;
  questionIds?: (ObjectId | string)[];
  createdAt?: Date;
  updatedAt?: Date;
}
