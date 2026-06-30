export const quizSchema: string = `#graphql
    
    type Quiz {
        _id: String!
        title: String!
        description: String!
        questionIds: [String!]!
        instructorId: String
        courseId: String!
        startDate: String!
        endDate: String!
        createdAt: String!
        updatedAt: String!
    }

    input CreateQuizInput {
        courseId: String!
        title: String!
        description: String!
        startDate: String!
        endDate: String!
        questionIds: [String!]!
    }    
    input UpdateQuizByIdInput {
        _id: String!
        title: String
        description: String
        startDate: String
        endDate: String
        questionIds: [String!]
    }  
    type Query {
        quiz(input:_IdInput!):Quiz!
        quizzes(input:CourseIdInput!):[Quiz!]!
    }

    type Mutation {
        createQuiz(input: CreateQuizInput!): Quiz!
        deleteQuizById(input: _IdInput!): Boolean!
        updateQuizById(input: UpdateQuizByIdInput!): Boolean!
    }
`;
