import {
  ClientSession,
  Collection,
  Filter,
  ObjectId,
  OptionalId,
  WithId,
} from "mongodb";
import { connect } from "../mongodb/mongodb.js";
import { QuizAttempt } from "../model/quizAttempt.model.js";
import { GetQuizAttemptInput } from "../graphql/interface/quizAttempt.interface.graphql.js";

export async function createQuizAttempt(
  quizAttempt: QuizAttempt,
): Promise<QuizAttempt> {
  const db = await connect();
  const now = new Date();
  let collection: Collection<QuizAttempt> =
    db.collection<QuizAttempt>("quizAttempts");
  const result = await collection.insertOne({
    score: quizAttempt.score,
    studentId: new ObjectId(quizAttempt.studentId),
    quizId: new ObjectId(quizAttempt.quizId),
    instructorId: new ObjectId(quizAttempt.instructorId),
    courseId: new ObjectId(quizAttempt.courseId),
    attemptedAt: now,
  });

  return {
    ...quizAttempt,
    _id: result.insertedId,
  };
}

export async function getQuizAttempt(
  quizAttempt: GetQuizAttemptInput,
): Promise<QuizAttempt | null> {
  const db = await connect();
  let collection = db.collection<QuizAttempt>("quizAttempts");
  const result = await collection.findOne({
    quizId: new ObjectId(quizAttempt.quizId),
    studentId: new ObjectId(quizAttempt.studentId),
  });
  if (result == null) {
    return null;
  }
  return result;
}

export async function getAllQuizAttempts(
  quizId: string,
): Promise<QuizAttempt[]> {
  const db = await connect();
  let collection: Collection<QuizAttempt> =
    db.collection<QuizAttempt>("quizAttempts");
  const result = await collection.find(
    { quizId: new ObjectId(quizId) },
    { projection: { instructorId: 0 } },
  );
  return result.toArray();
}
