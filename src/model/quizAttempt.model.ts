import { ObjectId } from "mongodb";

export interface QuizAttempt {
  _id?: ObjectId | string;
  quizId: ObjectId | string;
  score: number;
  studentId: ObjectId | string;
  courseId?: ObjectId | string;
  instructorId?: ObjectId | string;
  attemptedAt?: Date;
}
