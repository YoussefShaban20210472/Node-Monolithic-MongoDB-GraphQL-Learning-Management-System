export interface CreateAssignmentInput {
  title: string;
  courseId: string;
  score: number;
  description: string;
  startDate: string;
  endDate: string;
}

export interface UpdateAssignmentByIdInput {
  _id: string;
  title?: string;
  score?: number;
  description?: string;
  startDate?: string;
  endDate?: string;
}
export interface AssignmentIdInput {
  assignmentId: string;
}
export interface CreateAssignmentArgs {
  input: CreateAssignmentInput;
}

export interface UpdateAssignmentByIdArgs {
  input: UpdateAssignmentByIdInput;
}
export interface AssignmentIdArgs {
  input: AssignmentIdInput;
}
