export const CREATE_COURSE_BY_INSTRUCTOR = `
      mutation CreateCourseByInstructor($input: CreateCourseByInstructorInput!) {
        createCourseByInstructor(input: $input) {
        _id
        title
        description
        shortDescription
        instructorId
        startDate
        endDate
        tags
        categories
        }
      }
    `;
export const CREATE_COURSE_BY_ADMIN = `
      mutation CreateCourseByAdmin($input: CreateCourseByAdminInput!) {
        createCourseByAdmin(input: $input) {
        _id
        title
        description
        shortDescription
        instructorId
        startDate
        endDate
        tags
        categories
        }
      }
    `;
