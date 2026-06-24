export const requiredCourseFields = [
  { name: "title", domain: "Title" },
  { name: "description", domain: "Description" },
  { name: "shortDescription", domain: "ShortDescription" },
  { name: "startDate", domain: "Date" },
  { name: "endDate", domain: "Date" },
  { name: "tags", type: "StringArray", domain: "StringArray" },
  { name: "categories", type: "StringArray", domain: "StringArray" },
] as const;
