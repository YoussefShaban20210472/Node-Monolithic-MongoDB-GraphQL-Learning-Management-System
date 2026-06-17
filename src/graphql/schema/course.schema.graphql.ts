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

    # type Query {
    # }

    type Mutation {
        createCourseByInstructor(input: CreateCourseByInstructorInput!): Course!
        createCourseByAdmin(input: CreateCourseByAdminInput!): Course!
    }
`;
