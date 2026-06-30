export const CREATE_QUIZ = `
      mutation CreateQuiz($input: CreateQuizInput!) {
        createQuiz(input: $input) {
        _id
        title
        description
        courseId
        startDate
        endDate
        questionIds
        }
      }
    `;
export const DELETE_QUIZ_BY_ID = `
      mutation DeleteQuizById($input: _IdInput!) {
        deleteQuizById(input: $input)
      }
    `;

export const GET_ALL_QUIZZES = `
      query GetAllQuizzes($input: CourseIdInput!) {
        quizzes(input:$input){
        _id
        title
        description
        courseId
        startDate
        endDate
        questionIds
        }
      }
    `;
export const GET_QUIZ_BY_ID = `
      query GetQuiz($input: _IdInput!) {
        quiz(input:$input){
        _id
        title
        description
        courseId
        startDate
        endDate
        questionIds
        }
      }
    `;

export const UPDATE_QUIZ_BY_ID = `
      mutation UpdateQuizById($input: UpdateQuizByIdInput!) {
        updateQuizById(input: $input)
      }
    `;
