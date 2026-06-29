export const assignmentSchema: string = `#graphql
    
    type Assignment {
        _id: String!
        title: String!
        description: String!
        score: Int!
        instructorId: String
        courseId: String!
        startDate: String!
        endDate: String!
        createdAt: String!
        updatedAt: String!
    }

    input CreateAssignmentInput {
        courseId: String!
        title: String!
        score: Int!
        description: String!
        startDate: String!
        endDate: String!
    }    
    input UpdateAssignmentByIdInput {
        _id: String!
        title: String
        score: Int
        description: String
        startDate: String
        endDate: String
    }  
    input CourseIdInput {
        courseId: String!
    }  
    type Query {
        assignment(input:_IdInput!):Assignment!
        assignmentOTP(input:_IdInput!):String!
        assignments(input:CourseIdInput!):[Assignment!]!
    }

    type Mutation {
        createAssignment(input: CreateAssignmentInput!): Assignment!
        deleteAssignmentById(input: _IdInput!): Boolean!
        updateAssignmentById(input: UpdateAssignmentByIdInput!): Boolean!
    }
`;
