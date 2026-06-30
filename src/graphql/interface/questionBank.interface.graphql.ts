export interface CreateQuestionBankInput {
  courseId: string;
  question: string;
  answer: string;
  score: number;
  type: string;
  choices: string[];
}

export interface UpdateQuestionBankByIdInput {
  _id: string;
  question?: string;
  answer?: string;
  score?: number;
  type?: string;
  choices?: string[];
}
export interface QuestionBankIdInput {
  questionBankId: string;
}
export interface CreateQuestionBankArgs {
  input: CreateQuestionBankInput;
}

export interface UpdateQuestionBankByIdArgs {
  input: UpdateQuestionBankByIdInput;
}
export interface QuestionBankIdArgs {
  input: QuestionBankIdInput;
}
