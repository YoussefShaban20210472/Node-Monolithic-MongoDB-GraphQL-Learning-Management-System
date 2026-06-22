export interface Enrollment {
  studentId?: string;
  courseId: string;
}

export interface UpdateEnrollmentInput {
  studentId?: string;
  courseId: string;
  status: string;
}

export interface EnrollmentArgs {
  input: Enrollment;
}
export interface UpdateEnrollmentArgs {
  input: UpdateEnrollmentInput;
}
