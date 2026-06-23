export const courseSchema: string = `#graphql

    type Course {
        _id: String!
        title: String!
        description: String!
        shortDescription: String!
        instructorId: String!
        startDate: String!
        endDate: String!
        tags: [String!]!
        categories: [String!]!
        createdAt: String!
        updatedAt: String!
    }

    input CreateCourseByInstructorInput {
        title: String!
        description: String!
        shortDescription: String!
        startDate: String!
        endDate: String!
        tags: [String!]!
        categories: [String!]!
    }    
    input CreateCourseByAdminInput {
        title: String!
        description: String!
        shortDescription: String!
        instructorId: String!
        startDate: String!
        endDate: String!
        tags: [String!]!
        categories: [String!]!
    }
    input UpdateCourseByIdInput {
        _id: String!
        title: String
        description: String
        shortDescription: String
        startDate: String
        endDate: String
        tags: [String!]
        categories: [String!]
    }    
    type Query {
        course(input: _IdInput!):Course!
        courses:[Course!]!
    }

    type Mutation {
        createCourseByInstructor(input: CreateCourseByInstructorInput!): Course!
        createCourseByAdmin(input: CreateCourseByAdminInput!): Course!
        deleteCourseById(input: _IdInput!): Boolean!
        updateCourseById(input: UpdateCourseByIdInput!): Boolean!
    }
`;
