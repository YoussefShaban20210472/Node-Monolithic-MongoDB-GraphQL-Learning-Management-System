import { faker } from "@faker-js/faker";
import { endDate, startDate } from "../date-builder.js";

export function createRandomAssignment(courseId: string = ""): {
  title: string;
  description: string;
  score: number;
  startDate: string;
  endDate: string;
  courseId?: string;
} {
  return {
    title: faker.string.alpha({ length: { min: 5, max: 255 } }),
    description: faker.string.alpha({ length: { min: 20, max: 1000 } }),
    score: faker.number.int({ min: 0, max: 100 }),
    startDate: startDate,
    endDate: endDate,
    courseId: courseId,
  };
}
