import { z } from "zod";

export const HALF_HOUR = 1000 * 60 * 30;
export const ONE_DAY = 1000 * 60 * 60 * 24;
export const SEVEN_DAYS = 7 * ONE_DAY;
export const ONE_YEAR = 365 * ONE_DAY;

export function getMongoDbIdZObject(name: string) {
  return z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? `${name} is required`
          : `${name} must be string`,
    })
    .regex(/^[0-9a-fA-F]{24}$/, `${name} is invalid id`);
}
export function getStringZObject(
  name: string,
  min: number,
  max: number,
  pattern: string = "[A-Za-z]",
  type: string = "letters",
) {
  return z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? `${name} is required`
          : `${name} must be string`,
    })
    .regex(new RegExp(`^${pattern}{${min},${max}}$`), {
      error: (issue) =>
        issue.input!.length < min
          ? `${name} must be at least ${min} ${type}`
          : issue.input!.length > max
            ? `${name} must be at maximum ${max} ${type}`
            : `${name} must be only letters`,
    });
}
export function getDateZObject(name: string) {
  return z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? `${name} is required`
          : `${name} must be string`,
    })
    .datetime(`${name} must be valid ISO datetime string`);
}
export function getNumberZObject(name: string, min: number, max: number) {
  return z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? `${name} is required`
          : `${name} must be floading point`,
    })
    .min(min, `${name} must be at leat 0`)
    .max(max, `${name} must be at most 100`);
}
export function getEnumZObject(name: string, list: string[]) {
  return z.enum(list, {
    error: (issue) =>
      issue.input === undefined
        ? `${name} is required`
        : typeof issue.input !== "string"
          ? `${name} must be string`
          : `${name} must be one of these [${list.join(", ")}]`,
  });
}
export function getArrayZObject(
  name: string,
  min: number,
  max: number,
  minE: number = 1,
  maxE: number = 99999999,
) {
  return z
    .array(
      z
        .string({
          error: (issue) =>
            issue.input === undefined
              ? `${name} element is required`
              : `${name} element must be string`,
        })
        .regex(new RegExp(`^[A-Za-z]{${min},${max}}$`), {
          error: (issue) =>
            issue.input!.length < min
              ? `${name} element must be at least ${min} letters`
              : issue.input!.length > max
                ? `${name} element must be at maximum ${max} letters`
                : `${name} element must be only letters`,
        }),
      {
        error: (issue) =>
          issue.input === undefined
            ? `${name} is required`
            : `${name} must be array`,
      },
    )
    .min(minE, `You have to add at least ${minE} ${name}`)
    .max(maxE, `You can add at most ${maxE} ${name}`);
}

export function checkTimeNow(time: string) {
  const date = new Date(time);
  const now = new Date();
  return date >= now;
}
// function checkDuration(data, ctx, type) {
//   const start = new Date(data.start_date).getTime();
//   const end = new Date(data.end_date).getTime();

//   // ✅ validate both dates first
//   if (isNaN(start) || isNaN(end)) {
//     return;
//   }
//   const diff = end - start;

//   if (type === "minutes" && diff < HALF_HOUR) {
//     ctx.addIssue({
//       code: "custom",
//       path: ["end_date"],
//       message: "end_date must be at least 30 minutes after start_date",
//     });
//   }
//   if (type === "days" && diff < SEVEN_DAYS) {
//     ctx.addIssue({
//       code: "custom",
//       path: ["end_date"],
//       message: "end_date must be at least 7 days after start_date",
//     });
//   }

//   if (diff > ONE_YEAR) {
//     ctx.addIssue({
//       code: "custom",
//       path: ["end_date"],
//       message: "end_date must be at most 1 year after start_date",
//     });
//   }
// }
// function checkTimeBetweenNowAndYear(time) {
//   const date = new Date(time);
//   const now = new Date();
//   const oneYearFromNow = new Date(now.getTime() + ONE_YEAR);

//   return date >= now && date <= oneYearFromNow;
// }
// function assertValidTimeAndDuration(course, object, objectName) {
//   const course_start_date = new Date(course.start_date);
//   const course_end_date = new Date(course.end_date);
//   const start_date = new Date(object.start_date);
//   const end_date = new Date(object.end_date);
//   let message = undefined;
//   if (start_date < course_start_date) {
//     message = `${objectName} start date must start after course start date`;
//   } else if (start_date >= course_end_date) {
//     message = `${objectName} start date must start before course end date`;
//   } else if (end_date > course_end_date) {
//     message = `${objectName} end date must end before course end date`;
//   }
//   if (message) {
//     throw new BadRequest(message);
//   }
// }
