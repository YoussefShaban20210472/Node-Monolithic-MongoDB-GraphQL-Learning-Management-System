export const questionBankSchema: string = `#graphql
    
    type QuestionBank {
        _id: String!
        question: String!
        answer: String!
        type: String!
        choices: [String!]!
        score: Int!
        instructorId: String
        courseId: String!
        createdAt: String!
        updatedAt: String!
    }

    input CreateQuestionBankInput {
        question: String!
        answer: String!
        type: String!
        choices: [String!]!
        score: Int!
        courseId: String!
    }    
    input UpdateQuestionBankByIdInput {
        _id: String!
        question: String
        answer: String
        type: String
        choices: [String!]
        score: Int
    }   
    type Query {
        questionBank(input:_IdInput!):QuestionBank!
        allQuestionBank(input:CourseIdInput!):[QuestionBank!]!
    }

    type Mutation {
        createQuestionBank(input: CreateQuestionBankInput!): QuestionBank!
        deleteQuestionBankById(input: _IdInput!): Boolean!
        updateQuestionBankById(input: UpdateQuestionBankByIdInput!): Boolean!
    }
`;
