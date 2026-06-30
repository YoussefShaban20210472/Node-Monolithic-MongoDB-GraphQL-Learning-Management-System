export const quizAttemptSchema: string = `#graphql

    type QuizAttempt {
        _id: String!
        courseId: String!
        studentId: String!
        quizId: String!
        score: Int!
        attemptedAt: String!
    }
    input QuizAnswer {
        questionId:String!
        answer:String!
    }
    input CreateQuizAttemptByStudentInput {
        quizId: String!
        answers:[QuizAnswer!]!
    }    

    input CreateQuizAttemptByAdminInput {
        quizId: String!
        studentId: String!
        answers:[QuizAnswer!]!
    } 

    input GetQuizAttemptInput {
        quizId: String!
        studentId: String!
    }    
  
    type Query {
        quizAttemptByStudent(input: QuizIdInput!): QuizAttempt!
        quizAttempt(input: GetQuizAttemptInput!): QuizAttempt! 
        quizAttempts(input: QuizIdInput!): [QuizAttempt! ]!
    }

    type Mutation {
        createQuizAttemptByStudent(input: CreateQuizAttemptByStudentInput!): QuizAttempt!
        createQuizAttemptByAdmin(input: CreateQuizAttemptByAdminInput!): QuizAttempt!    
    }
`;
