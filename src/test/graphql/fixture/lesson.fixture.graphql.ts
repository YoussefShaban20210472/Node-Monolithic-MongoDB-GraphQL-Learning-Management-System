export const requiredLessonFields = [
  { name: "title", domain: "Title" },
  { name: "description", domain: "Description" },
  { name: "startDate", domain: "Date" },
  { name: "endDate", domain: "Date" },
  { name: "courseId", domain: "ID" },
] as const;
export const updateLessonFields = [
  { name: "title", domain: "Title" },
  { name: "description", domain: "Description" },
  { name: "startDate", domain: "Date" },
  { name: "endDate", domain: "Date" },
] as const;
