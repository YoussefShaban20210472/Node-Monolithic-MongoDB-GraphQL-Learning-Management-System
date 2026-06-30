export interface CreateQuizAttemptByStudentInput {
  quizId: string;
  answers: { questionId: string; answer: string }[];
}
export interface CreateQuizAttemptByAdminInput {
  quizId: string;
  studentId: string;
  answers: { questionId: string; answer: string }[];
}
export interface CreateQuizAttemptInput {
  quizId: string;
  studentId: string;
  answers: { questionId: string; answer: string }[];
}
export interface GetQuizAttemptInput {
  quizId: string;
  studentId: string;
}

export interface QuizAttemptIdInput {
  quizAttemptId: string;
}
export interface CreateQuizAttemptByStudentArgs {
  input: CreateQuizAttemptByStudentInput;
}
export interface CreateQuizAttemptByAdminArgs {
  input: CreateQuizAttemptByAdminInput;
}
export interface GetQuizAttemptArgs {
  input: GetQuizAttemptInput;
}

export interface QuizAttemptIdArgs {
  input: QuizAttemptIdInput;
}
