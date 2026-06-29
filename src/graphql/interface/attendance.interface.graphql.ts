export interface AttendanceInput {
  studentId: string;
  lessonId: string;
  otp: string;
}

export interface AttendStudentByStudentInput {
  lessonId: string;
  otp: string;
}
export interface AttendStudentByAdminInput {
  studentId: string;
  lessonId: string;
  otp: string;
}

export interface GetAttendanceInput {
  studentId: string;
  lessonId: string;
}

export interface AttendStudentByStudentArgs {
  input: AttendStudentByStudentInput;
}
export interface AttendStudentByAdminArgs {
  input: AttendStudentByAdminInput;
}

export interface GetAttendanceArgs {
  input: GetAttendanceInput;
}
