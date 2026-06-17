export const commonInvalidCourseValues = [
  "1",
  "12313",
  "1069",
  "0",
  "10.0",
  "10.110",
  "+10.110",
  "-10000.110",
  "-0.110",
  "Yes_",
  "_Yes",
  "PhP1",
  "Goo0od",
  "0Goood",
  "@Goood",
  "*Goood",
  "@@@@@@@",
  "2021-01-20",
  "2026-06-16",
  "2026-06-15",
  "2030-06-15",
  "2050-06-15",
  "2150-06-15",
];
const invalidShortStringValues = [
  "AA",
  "AB",
  "A",
  "V",
  "Q",
  "ac",
  "acAE",
  "you",
  "they",
];
const invalidLongStringValues = [
  Array.from({ length: 501 }, (__, _) => "a").join(""),
  Array.from({ length: 1000 }, (__, _) => "A").join(""),
  Array.from({ length: 1500 }, (__, _) => "Q").join(""),
  Array.from({ length: 2000 }, (__, _) => "C").join(""),
  Array.from({ length: 3000 }, (__, _) => "a").join(""),
];
const invalidTopicsValues = [
  ...commonInvalidCourseValues.map((e) => [e]),
  ...invalidLongStringValues.map((e) => [e]),
  ["aaa", "bbbbbb", "1"],
  ["AA", "0@"],
  ["Amazing", "PHP", "Learning", "Good_Person"],
];
const common = [
  ...commonInvalidCourseValues,
  ...invalidLongStringValues,
  ...invalidShortStringValues,
];
export const specificInvalidCourseValues = {
  title: common,
  description: commonInvalidCourseValues,
  shortDescription: common,
  startDate: common,
  endDate: common,
  tags: invalidTopicsValues,
  categories: invalidTopicsValues,
};
