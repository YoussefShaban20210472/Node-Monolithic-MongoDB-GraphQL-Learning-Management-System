import {
  ClientSession,
  Collection,
  Filter,
  ObjectId,
  OptionalId,
  WithId,
} from "mongodb";
import { connect } from "../mongodb/mongodb.js";
import { Quiz } from "../model/quiz.model.js";

export async function createQuiz(quiz: Quiz): Promise<Quiz> {
  const db = await connect();
  const now = new Date();
  let collection: Collection<Quiz> = db.collection<Quiz>("quizzes");
  const result = await collection.insertOne({
    title: String(quiz.title),
    description: String(quiz.description),
    instructorId: new ObjectId(quiz.instructorId),
    courseId: new ObjectId(quiz.courseId),
    startDate: new Date(quiz.startDate),
    endDate: new Date(quiz.endDate),
    questionIds: quiz.questionIds,
    createdAt: now,
    updatedAt: now,
  });

  return {
    ...quiz,
    createdAt: now,
    updatedAt: now,
    _id: result.insertedId,
  };
}

export async function deleteQuizById(_id: string): Promise<boolean> {
  const db = await connect();
  let collection = db.collection<Quiz>("quizzes");
  const result = await collection.deleteOne({
    _id: new ObjectId(_id),
  });
  return result.deletedCount > 0;
}
export async function getQuizById(_id: string): Promise<Quiz | null> {
  const db = await connect();
  let collection = db.collection<Quiz>("quizzes");
  const result = await collection.findOne({
    _id: new ObjectId(_id),
  });
  if (result == null) {
    return null;
  }
  return {
    ...result,
    startDate: new Date(result.startDate).toISOString(),
    endDate: new Date(result.endDate).toISOString(),
  };
}

export async function getAllQuizzes(courseId: string): Promise<Quiz[]> {
  const db = await connect();
  let collection: Collection<Quiz> = db.collection<Quiz>("quizzes");
  const result = await collection.find(
    { courseId: new ObjectId(courseId) },
    { projection: { instructorId: 0 } },
  );
  return result.toArray();
}

export async function updateQuizById(
  _id: string,
  data: Partial<Quiz>,
): Promise<Boolean> {
  const db = await connect();
  let collection: Collection<Quiz> = db.collection<Quiz>("quizzes");
  const result = await collection.updateOne(
    { _id: new ObjectId(_id) },
    { $set: data },
  );
  return result.matchedCount > 0;
}
