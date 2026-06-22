export const enrollmentSchema: string = `#graphql

    type Enrollment {
        _id: String!
        courseId: String!
        studentId: String!
        status: String!
        createdAt: String!
        updatedAt: String!
    }

    input EnrollmentByStudentInput {
        courseId: String!
    }    

    input EnrollmentByAdminInput {
        courseId: String!
        studentId: String!
    }    

    input ConfirmEnrollmentInput {
        courseId: String!
        studentId: String!
        status: String!
    }    
    # type Query {
    # }

    type Mutation {
        enrollStudentByStudent(input: EnrollmentByStudentInput!): Enrollment!
        enrollStudentByAdmin(input: EnrollmentByAdminInput!): Enrollment!    

        getEnrollmentByStudent(input: EnrollmentByStudentInput!): Enrollment!
        getEnrollmentByAdmin(input: EnrollmentByAdminInput!): Enrollment! 

        deleteEnrollmentByStudent(input: EnrollmentByStudentInput!): Boolean!
        deleteEnrollmentByAdmin(input: EnrollmentByAdminInput!): Boolean!

        confirmEnrollment(input: ConfirmEnrollmentInput!): Boolean!
    }
`;
