export const ENROLL_STUDENT_BY_STUDENT = `
      mutation EnrollStudentByStudent($input: EnrollmentByStudentInput!) {
        enrollStudentByStudent(input: $input) {
        _id
        studentId
        courseId
        status
        }
      }
    `;
export const ENROLL_STUDENT_BY_ADMIN = `
      mutation EnrollStudentByAdmin($input: EnrollmentByAdminInput!) {
        enrollStudentByAdmin(input: $input) {
        _id
        studentId
        courseId
        status
        }
      }
    `;
export const GET_ENROLLMENT_BY_STUDENT = `
      mutation GetEnrollmentByStudent($input: EnrollmentByStudentInput!) {
        getEnrollmentByStudent(input: $input){
        _id
        studentId
        courseId
        status
        }
      }
    `;
export const GET_ENROLLMENT_BY_ADMIN = `
      mutation GetEnrollmentByAdmin($input: EnrollmentByAdminInput!) {
        getEnrollmentByAdmin(input: $input){
        _id
        studentId
        courseId
        status
        }
      }
    `;
export const DELETE_ENROLLMENT_BY_STUDENT = `
      mutation DeleteEnrollmentByStudent($input: EnrollmentByStudentInput!) {
        deleteEnrollmentByStudent(input: $input)
      }
    `;
export const DELETE_ENROLLMENT_BY_ADMIN = `
      mutation DeleteEnrollmentByAdmin($input: EnrollmentByAdminInput!) {
        deleteEnrollmentByAdmin(input: $input)
      }
    `;
export const CONFIRM_ENROLLMENT = `
      mutation ConfirmEnrollment($input: ConfirmEnrollmentInput!) {
        confirmEnrollment(input: $input)
      }
    `;
