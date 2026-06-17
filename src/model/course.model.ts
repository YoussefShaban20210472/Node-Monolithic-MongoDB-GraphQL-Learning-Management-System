import { ObjectId } from "mongodb";

export interface Course {
  _id?: ObjectId | string;
  title: string;
  description: string;
  shortDescription: string;
  instructorId: ObjectId | string;
  startDate: string | Date;
  endDate: string | Date;
  tagIds?: (ObjectId | string)[];
  categoryIds?: (ObjectId | string)[];
  createdAt?: Date;
  updatedAt?: Date;
}
export interface Topic {
  _id?: ObjectId | string;
  name: string;
}
