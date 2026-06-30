import {
  ClientSession,
  Collection,
  Filter,
  ObjectId,
  OptionalId,
  WithId,
} from "mongodb";
import { connect } from "../mongodb/mongodb.js";
import { QuestionBank } from "../model/questionBank.model.js";

export async function createQuestionBank(
  questionBank: QuestionBank,
): Promise<QuestionBank> {
  const db = await connect();
  const now = new Date();
  let collection: Collection<QuestionBank> =
    db.collection<QuestionBank>("questionBank");
  const question = {
    courseId: new ObjectId(questionBank.courseId),
    instructorId: new ObjectId(questionBank.instructorId),
    question: String(questionBank.question),
    answer: String(questionBank.answer),
    type: String(questionBank.type),
    score: questionBank.score,
    choices: questionBank.choices,
    createdAt: now,
    updatedAt: now,
  };
  const result = await collection.insertOne(question);
  return {
    ...question,
    _id: result.insertedId,
  };
}

export async function deleteQuestionBankById(_id: string): Promise<boolean> {
  const db = await connect();
  let collection = db.collection<QuestionBank>("questionBank");
  const result = await collection.deleteOne({
    _id: new ObjectId(_id),
  });
  return result.deletedCount > 0;
}
export async function getQuestionBankById(
  _id: string,
): Promise<QuestionBank | null> {
  const db = await connect();
  let collection = db.collection<QuestionBank>("questionBank");
  const result = await collection.findOne({
    _id: new ObjectId(_id),
  });
  if (result == null) {
    return null;
  }
  return result;
}

export async function getAllQuestionBank(
  courseId: string,
): Promise<QuestionBank[]> {
  const db = await connect();
  let collection: Collection<QuestionBank> =
    db.collection<QuestionBank>("questionBank");
  const result = await collection.find({ courseId: new ObjectId(courseId) });
  return result.toArray();
}

export async function updateQuestionBankById(
  _id: string,
  data: Partial<QuestionBank>,
): Promise<Boolean> {
  const db = await connect();
  let collection: Collection<QuestionBank> =
    db.collection<QuestionBank>("questionBank");
  const result = await collection.updateOne(
    { _id: new ObjectId(_id) },
    { $set: data },
  );
  return result.matchedCount > 0;
}
