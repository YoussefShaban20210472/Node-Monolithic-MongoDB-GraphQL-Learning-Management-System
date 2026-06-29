export const CREATE_ASSIGNMENT = `
      mutation CreateAssignment($input: CreateAssignmentInput!) {
        createAssignment(input: $input) {
        _id
        title
        description
        score
        courseId
        startDate
        endDate
        }
      }
    `;
export const DELETE_ASSIGNMENT_BY_ID = `
      mutation DeleteAssignmentById($input: _IdInput!) {
        deleteAssignmentById(input: $input)
      }
    `;

export const GET_ALL_ASSIGNMENTS = `
      query GetAllAssignments($input: CourseIdInput!) {
        assignments(input:$input){
        _id
        title
        description
        score
        courseId
        startDate
        endDate
        }
      }
    `;
export const GET_ASSIGNMENT_BY_ID = `
      query GetAssignment($input: _IdInput!) {
        assignment(input:$input){
        _id
        title
        description
        score
        courseId
        startDate
        endDate
        }
      }
    `;
export const GET_ASSIGNMENT_OTP_BY_ID = `
      query GetAssignmentOTP($input: _IdInput!) {
        assignmentOTP(input:$input)
      }
    `;
export const UPDATE_ASSIGNMENT_BY_ID = `
      mutation UpdateAssignmentById($input: UpdateAssignmentByIdInput!) {
        updateAssignmentById(input: $input)
      }
    `;
