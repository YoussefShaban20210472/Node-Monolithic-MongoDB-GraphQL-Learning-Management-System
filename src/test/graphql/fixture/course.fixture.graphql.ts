export const requiredCourseFields = [
  { name: "title" },
  { name: "description" },
  { name: "shortDescription" },
  { name: "startDate" },
  { name: "endDate" },
  { name: "tags", type: "StringArray" },
  { name: "categories", type: "StringArray" },
] as const;
