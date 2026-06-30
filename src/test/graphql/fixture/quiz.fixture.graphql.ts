export const requiredQuizFields = [
  { name: "title", domain: "Title" },
  { name: "description", domain: "Description" },
  { name: "startDate", domain: "Date" },
  { name: "endDate", domain: "Date" },
  { name: "courseId", domain: "ID" },
  { name: "questionIds", type: "StringArray", domain: "IDArray" },
] as const;
export const updateQuizFields = [
  { name: "title", domain: "Title" },
  { name: "description", domain: "Description" },
  { name: "startDate", domain: "Date" },
  { name: "endDate", domain: "Date" },
  { name: "questionIds", type: "StringArray", domain: "IDArray" },
] as const;
