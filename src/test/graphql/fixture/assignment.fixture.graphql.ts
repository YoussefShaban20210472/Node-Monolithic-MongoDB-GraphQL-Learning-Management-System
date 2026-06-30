export const requiredAssignmentFields = [
  { name: "title", domain: "Title" },
  { name: "description", domain: "Description" },
  { name: "score", type: "Number", domain: "Score" },
  { name: "startDate", domain: "Date" },
  { name: "endDate", domain: "Date" },
  { name: "courseId", domain: "ID" },
] as const;
export const updateAssignmentFields = [
  { name: "title", domain: "Title" },
  { name: "description", domain: "Description" },
  { name: "score", type: "Number", domain: "Score" },
  { name: "startDate", domain: "Date" },
  { name: "endDate", domain: "Date" },
] as const;
