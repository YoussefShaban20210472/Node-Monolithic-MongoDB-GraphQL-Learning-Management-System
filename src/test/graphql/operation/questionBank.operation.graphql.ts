export const CREATE_QUESTION_BANK = `
      mutation CreateQuestionBank($input: CreateQuestionBankInput!) {
        createQuestionBank(input: $input) {
        _id
        question
        answer
        courseId
        score
        type
        choices
        }
      }
    `;
export const DELETE_QUESTION_BANK_BY_ID = `
      mutation DeleteQuestionBankById($input: _IdInput!) {
        deleteQuestionBankById(input: $input)
      }
    `;

export const GET_ALL_QUESTION_BANK = `
      query GetAllQuestionBank($input: CourseIdInput!) {
        allQuestionBank(input:$input){
        _id
        question
        answer
        courseId
        score
        type
        choices
        }
      }
    `;
export const GET_QUESTION_BANK_BY_ID = `
      query GetQuestionBank($input: _IdInput!) {
        questionBank(input:$input){
        _id
        question
        answer
        courseId
        score
        type
        choices
        }
      }
    `;
export const GET_QUESTION_BANK_OTP_BY_ID = `
      query GetQuestionBankOTP($input: _IdInput!) {
        questionBankOTP(input:$input)
      }
    `;
export const UPDATE_QUESTION_BANK_BY_ID = `
      mutation UpdateQuestionBankById($input: UpdateQuestionBankByIdInput!) {
        updateQuestionBankById(input: $input)
      }
    `;
