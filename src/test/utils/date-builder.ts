import {
  createIntervals,
  setDate,
  setMinute,
  setMonth,
  setYear,
} from "./helper/date.helper.js";
// 2027-05-11T14:17:01.909Z
// '2027-06-18T14:17:01.909Z'
export const courseStartDate = setDate(new Date(), 1).toISOString();
export const courseEndDate = setYear(
  new Date(courseStartDate),
  1,
).toISOString();
export const startDate = setMonth(new Date(courseEndDate), 1).toISOString();
export const endDate = setMonth(new Date(startDate), 1).toISOString();

export const invalidCourseDurationFields = {
  startDate: [
    ...createIntervals(new Date("2000-05-20T00:00:00Z"), new Date()),
    ...createIntervals(
      setDate(new Date(courseEndDate), -7),
      new Date(courseEndDate),
    ),
    ...createIntervals(
      new Date(courseEndDate),
      setYear(new Date(courseEndDate), 1),
    ),
    ...createIntervals(
      setYear(new Date(courseEndDate), 1),
      setYear(new Date(courseEndDate), 5),
    ),
  ],
  endDate: [
    ...createIntervals(
      setYear(new Date(courseStartDate), -5),
      setDate(new Date(courseStartDate), 7),
    ),
    ...createIntervals(
      setYear(new Date(courseStartDate), 1),
      setYear(new Date(courseStartDate), 5),
    ),
  ],
};

export const invalidObjectDurationFields = {
  startDate: [
    ...createIntervals(
      setYear(new Date(courseStartDate), -5),
      new Date(courseStartDate),
    ),

    ...createIntervals(setMinute(new Date(endDate), -30), new Date(endDate)),

    ...createIntervals(new Date(endDate), new Date(courseEndDate)),

    ...createIntervals(
      new Date(courseEndDate),
      setYear(new Date(courseEndDate), 5),
    ),
  ],
  endDate: [
    ...createIntervals(
      setYear(new Date(courseStartDate), -5),
      new Date(courseStartDate),
    ),

    ...createIntervals(new Date(courseStartDate), new Date(startDate)),

    ...createIntervals(new Date(startDate), setMinute(new Date(startDate), 30)),

    ...createIntervals(
      new Date(courseEndDate),
      setYear(new Date(courseEndDate), 5),
    ),
  ],
};
