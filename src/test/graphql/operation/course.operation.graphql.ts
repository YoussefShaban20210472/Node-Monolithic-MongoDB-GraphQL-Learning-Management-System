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
export const DELETE_COURSE_BY_ID = `
      mutation DeleteCourseById($input: String!) {
        deleteCourseById(_id: $input)
      }
    `;
export const GET_COURSE_BY_ID = `
      query GetCourseById($input: String!) {
        course(_id: $input){
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
export const GET_ALL_COURSES = `
      query GetAllCourses {
        courses{
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

export const UPDATE_COURSE_BY_ID = `
      mutation UpdateCourseById($input: UpdateCourseByIdInput!) {
        updateCourseById(input: $input)
      }
    `;
