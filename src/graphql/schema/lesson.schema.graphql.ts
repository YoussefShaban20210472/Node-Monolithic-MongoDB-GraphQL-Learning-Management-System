export const lessonSchema: string = `#graphql
    
    type Lesson {
        _id: String!
        title: String!
        description: String!
        otp: String
        instructorId: String
        courseId: String!
        startDate: String!
        endDate: String!
        createdAt: String!
        updatedAt: String!
    }

    input CreateLessonInput {
        courseId: String!
        title: String!
        description: String!
        startDate: String!
        endDate: String!
    }    
    input UpdateLessonByIdInput {
        _id: String!
        title: String
        description: String
        startDate: String
        endDate: String
    }  
    input CourseIdInput {
        courseId: String!
    }  
    type Query {
        # course(input: _IdInput!):Course!
        lesson(input:_IdInput!):Lesson!
        lessonOTP(input:_IdInput!):String!
        lessons(input:CourseIdInput!):[Lesson!]!
    }

    type Mutation {
        createLesson(input: CreateLessonInput!): Lesson!
        deleteLessonById(input: _IdInput!): Boolean!
        updateLessonById(input: UpdateLessonByIdInput!): Boolean!
        # createCourseByAdmin(input: CreateCourseByAdminInput!): Course!
    }
`;
