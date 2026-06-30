export const requiredQuizAttemptByStudentFields = [
  { name: "quizId", domain: "ID" },
  { name: "answers", type: "ObjectArray", domain: "QuestionAnswerObject" },
] as const;

export const requiredQuizAttemptByAdminFields = [
  { name: "quizId", domain: "ID" },
  { name: "studentId", domain: "ID" },
  { name: "answers", type: "ObjectArray", domain: "QuestionAnswerObject" },
] as const;
export const getQuizAttemptByStudentFields = [
  { name: "quizId", domain: "ID" },
] as const;

export const getQuizAttemptFields = [
  { name: "quizId", domain: "ID" },
  { name: "studentId", domain: "ID" },
] as const;
