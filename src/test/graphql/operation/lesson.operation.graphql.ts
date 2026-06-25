export const CREATE_LESSON = `
      mutation CreateLesson($input: CreateLessonInput!) {
        createLesson(input: $input) {
        _id
        title
        description
        courseId
        startDate
        endDate
        }
      }
    `;
export const DELETE_LESSON_BY_ID = `
      mutation DeleteLessonById($input: _IdInput!) {
        deleteLessonById(input: $input)
      }
    `;

export const GET_ALL_LESSONS = `
      query GetAllLessons($input: CourseIdInput!) {
        lessons(input:$input){
        _id
        title
        description
        courseId
        startDate
        endDate
        }
      }
    `;
export const GET_LESSON_BY_ID = `
      query GetLesson($input: _IdInput!) {
        lesson(input:$input){
        _id
        title
        description
        courseId
        startDate
        endDate
        }
      }
    `;
export const GET_LESSON_OTP_BY_ID = `
      query GetLessonOTP($input: _IdInput!) {
        lessonOTP(input:$input)
      }
    `;
export const UPDATE_LESSON_BY_ID = `
      mutation UpdateLessonById($input: UpdateLessonByIdInput!) {
        updateLessonById(input: $input)
      }
    `;
