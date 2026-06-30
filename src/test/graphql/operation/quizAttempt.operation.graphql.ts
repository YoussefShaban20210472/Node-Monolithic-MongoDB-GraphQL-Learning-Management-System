export const CREATE_QUIZ_ATTEMPT_BY_STUDENT = `
      mutation CreateQuizAttemptByStudent($input: CreateQuizAttemptByStudentInput!) {
        createQuizAttemptByStudent(input: $input) {
        _id
        score
        courseId
        studentId
        quizId
        }
      }
    `;
export const CREATE_QUIZ_ATTEMPT_BY_ADMIN = `
      mutation CreateQuizAttemptByAdmin($input: CreateQuizAttemptByAdminInput!) {
        createQuizAttemptByAdmin(input: $input) {
        _id
        score
        courseId
        studentId
        quizId
        }
      }
    `;

export const GET_ALL_QUIZ_ATTEMPTS = `
      query GetAllQuizAttempts($input: QuizIdInput!) {
        quizAttempts(input:$input){
        _id
        score
        courseId
        studentId
        quizId
        }
      }
    `;
export const GET_QUIZ_ATTEMPT_BY_STUDENT = `
      query GetquizAttemptByStudent($input: QuizIdInput!) {
        quizAttemptByStudent(input:$input){
        _id
        score
        courseId
        studentId
        quizId
        }
      }
    `;

export const GET_QUIZ_ATTEMPT = `
      query GetQuizAttempt($input: GetQuizAttemptInput!) {
        quizAttempt(input:$input){
        _id
        score
        courseId
        studentId
        quizId
        }
      }
    `;
