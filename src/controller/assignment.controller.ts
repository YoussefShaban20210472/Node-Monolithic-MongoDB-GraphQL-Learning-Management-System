import * as assignmentService from "../service/assignment.service.js";
import {
  Context,
  CourseIdArgs,
  IdArgs,
} from "../graphql/interface/interface.graphql.js";

import {
  CreateAssignmentArgs,
  UpdateAssignmentByIdArgs,
} from "../graphql/interface/assignment.interface.graphql.js";
import { Assignment } from "../model/assignment.model.js";

export async function createAssignment(
  _: unknown,
  args: CreateAssignmentArgs,
  context: Context,
  ___: unknown,
): Promise<Assignment> {
  const result = await assignmentService.createAssignment(args.input);
  return result;
}

export async function deleteAssignmentById(
  _: unknown,
  args: IdArgs,
  __: Context,
  ___: unknown,
): Promise<boolean> {
  const result = await assignmentService.deleteCourseById(args.input._id);
  return result;
}

export async function getAllAssignments(
  _: unknown,
  args: CourseIdArgs,
  __: Context,
  ___: unknown,
): Promise<Assignment[]> {
  const result = await assignmentService.getAllAssignments(args.input.courseId);
  return result;
}

export async function getAssignmentById(
  _: unknown,
  args: IdArgs,
  __: Context,
  ___: unknown,
): Promise<Assignment> {
  const result = await assignmentService.getAssignmentById(args.input._id);
  return result;
}

export async function updateAssignmentById(
  _: unknown,
  args: UpdateAssignmentByIdArgs,
  __: Context,
  ___: unknown,
): Promise<Boolean> {
  const _id = args.input._id;
  const result = await assignmentService.updateAssignmentById(_id, args.input);
  return result;
}
