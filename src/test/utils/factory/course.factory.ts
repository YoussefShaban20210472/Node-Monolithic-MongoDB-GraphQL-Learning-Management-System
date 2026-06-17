import { faker } from "@faker-js/faker";
import { courseEndDate, courseStartDate } from "../date-builder.js";

export function createRandomCourse() {
  return {
    title: faker.string.alpha({ length: { min: 5, max: 255 } }),
    shortDescription: faker.string.alpha({ length: { min: 20, max: 500 } }),
    description: faker.string.alpha({ length: { min: 20, max: 1000 } }),
    startDate: courseStartDate,
    endDate: courseEndDate,
    tags: Array.from({ length: faker.number.int({ min: 1, max: 100 }) }, () =>
      faker.string.alpha({ length: { min: 5, max: 10 } }),
    ),
    categories: Array.from(
      { length: faker.number.int({ min: 1, max: 100 }) },
      () => faker.string.alpha({ length: { min: 5, max: 10 } }),
    ),
  };
}
