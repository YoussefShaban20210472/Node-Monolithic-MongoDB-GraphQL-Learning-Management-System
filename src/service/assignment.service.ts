import * as assignmentRepository from "../repository/assignment.repository.js";

import { BadRequest, ObjectNotFound } from "../error/business.error.js";
import { updateCourseSchema } from "../validator/course.validator.js";
import {
  assertValidTimeAndDuration,
  courseIdSchema,
  idSchema,
} from "../validator/validator.js";
import { assignmentSchema } from "../validator/assignment.validator.js";
import { Assignment } from "../model/assignment.model.js";
import { getPartialCourseById } from "./course.service.js";

export async function isInstructorIsAssignmentCreator(
  instructorId: string,
  _id: string,
) {
  const assignment = await assignmentRepository.getAssignmentById(_id);
  if (assignment == null) {
    return false;
  }

  return assignment?.instructorId?.toString() === instructorId;
}
export async function createAssignment(assignment: Assignment) {
  assignmentSchema.parse(assignment);
  const course = await getPartialCourseById(assignment.courseId.toString());

  await assertValidTimeAndDuration(course, assignment, "Assignment");
  assignment.instructorId = course?.instructorId;
  const result = await assignmentRepository.createAssignment(assignment);
  return result;
}

export async function deleteCourseById(_id: string) {
  idSchema.parse({ _id });
  const result = await assignmentRepository.deleteAssignmentById(_id);
  if (!result) {
    throw new ObjectNotFound("Assignment");
  }
  return result;
}

export async function getAllAssignments(courseId: string) {
  courseIdSchema.parse({ courseId });
  const result = await assignmentRepository.getAllAssignments(courseId);
  return result;
}

export async function getAssignmentById(_id: string) {
  idSchema.parse({ _id });
  const result = await assignmentRepository.getAssignmentById(_id);
  if (result == null) {
    throw new ObjectNotFound("Assignment");
  }
  delete result.instructorId;
  return result;
}

export async function updateAssignmentById(
  _id: string,
  data: Partial<Assignment>,
) {
  idSchema.parse({ _id });
  const updateAssignmentFields = ["title", "description"] as const;
  const safeData: Partial<Assignment> = {};
  for (let field of updateAssignmentFields) {
    if (data[field] != null) {
      safeData[field] = data[field];
    }
  }
  if (data.score != null) {
    safeData.score = data.score;
  }
  if (data.startDate != null) {
    safeData.startDate = new Date(data.startDate);
  }
  if (data.endDate != null) {
    safeData.endDate = new Date(data.endDate);
  }

  if (Object.keys(safeData).length === 0) {
    throw new BadRequest(
      "At least one field must be provided to update assignment",
    );
  }

  const oldAssignment = await getAssignmentById(_id);
  if (data.startDate == null) {
    data.startDate = oldAssignment?.startDate;
  }
  if (data.endDate == null) {
    data.endDate = oldAssignment?.endDate;
  }

  updateCourseSchema.parse(data);
  const course = await getPartialCourseById(oldAssignment.courseId.toString());

  await assertValidTimeAndDuration(course, oldAssignment, "Assignment");

  const result = await assignmentRepository.updateAssignmentById(_id, safeData);

  if (!result) {
    throw new ObjectNotFound("Assignment");
  }
  return result;
}
