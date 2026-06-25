import { faker } from "@faker-js/faker";
import { endDate, startDate } from "../date-builder.js";

export function createRandomLesson(courseId: string = ""): {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  courseId?: string;
} {
  return {
    title: faker.string.alpha({ length: { min: 5, max: 255 } }),
    description: faker.string.alpha({ length: { min: 20, max: 1000 } }),
    startDate: startDate,
    endDate: endDate,
    courseId: courseId,
  };
}
