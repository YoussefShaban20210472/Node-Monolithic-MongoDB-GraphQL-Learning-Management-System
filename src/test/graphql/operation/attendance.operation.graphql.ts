export const ATTEND_STUDENT_BY_STUDENT = `
      mutation AttendStudentByStudent($input: AttendStudentByStudentInput!) {
        attendStudentByStudent(input: $input) {
        _id
        studentId
        lessonId
        }
      }
    `;
export const ATTEND_STUDENT_BY_ADMIN = `
      mutation AttendStudentByAdmin($input: AttendStudentByAdminInput!) {
        attendStudentByAdmin(input: $input) {
        _id
        studentId
        lessonId
        }
      }
    `;

export const GET_ATTENDANCE_BY_STUDENT = `
      query GetAttendanceByStudent($input: LessonIdInput!) {
        attendanceByStudent(input: $input) {
        _id
        studentId
        lessonId
        }
      }
    `;
export const GET_ATTENDANCE = `
      query GetAttendance($input: GetAttendanceInput!) {
        attendance(input: $input) {
        _id
        studentId
        lessonId
        }
      }
    `;
export const GET_ALL_LESSON_ATTENDANCES = `
      query GetAllLessonAttendances($input: LessonIdInput!) {
        lessonAttendances(input: $input) {
        _id
        studentId
        lessonId
        }
      }
    `;
