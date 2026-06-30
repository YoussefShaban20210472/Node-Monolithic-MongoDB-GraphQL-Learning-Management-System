export const requiredQuestionBankFields = [
  { name: "question", domain: "Question" },
  { name: "answer", domain: "Answer" },
  { name: "score", type: "Number", domain: "Score" },
  { name: "type", domain: "QuestionType" },
  { name: "choices", type: "StringArray", domain: "Choice" },
  { name: "courseId", domain: "ID" },
] as const;
export const updateQuestionBankFields = [
  { name: "question", domain: "Question" },
  { name: "answer", domain: "Answer" },
  { name: "score", type: "Number", domain: "Score" },
  { name: "type", domain: "QuestionType" },
  { name: "choices", type: "StringArray", domain: "Choice" },
] as const;
