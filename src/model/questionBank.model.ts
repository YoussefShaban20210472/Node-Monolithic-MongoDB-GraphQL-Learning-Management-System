import { ObjectId } from "mongodb";

export interface QuestionBank {
  _id?: ObjectId | string;
  courseId: ObjectId | string;
  instructorId?: ObjectId | string;
  question: string;
  answer: string;
  score: number;
  type: string;
  choices: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
