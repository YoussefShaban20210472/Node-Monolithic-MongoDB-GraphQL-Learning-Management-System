export const requiredAttendanceByStudentFields = [
  { name: "lessonId", domain: "ID" },
  { name: "otp", domain: "OTP" },
] as const;
export const requiredAttendanceByAdminFields = [
  { name: "lessonId", domain: "ID" },
  { name: "studentId", domain: "ID" },
  { name: "otp", domain: "OTP" },
] as const;

export const requiredGetAttendanceByStudentFields = [
  { name: "lessonId", domain: "ID" },
] as const;
export const requiredGetAttendanceFields = [
  { name: "lessonId", domain: "ID" },
  { name: "studentId", domain: "ID" },
] as const;
