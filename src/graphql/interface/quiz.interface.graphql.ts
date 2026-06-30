export interface CreateQuizInput {
  title: string;
  courseId: string;
  description: string;
  startDate: string;
  endDate: string;
  questionIds: string[];
}

export interface UpdateQuizByIdInput {
  _id: string;
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  questionIds?: string[];
}
export interface QuizIdInput {
  quizId: string;
}
export interface CreateQuizArgs {
  input: CreateQuizInput;
}

export interface UpdateQuizByIdArgs {
  input: UpdateQuizByIdInput;
}
export interface QuizIdArgs {
  input: QuizIdInput;
}
