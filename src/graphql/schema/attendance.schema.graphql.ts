export const attendanceSchema: string = `#graphql
    
    type Attendance {
        _id: String!
        studentId: String!
        lessonId: String!
        attendedAt: String!
    }

    input AttendStudentByStudentInput {
        lessonId: String!
        otp: String!
    }     
    input AttendStudentByAdminInput {
        studentId: String!
        lessonId: String!
        otp: String!
    }       
    input LessonIdInput {
        lessonId: String!
    }     
    input GetAttendanceInput {
        studentId: String!
        lessonId: String!
    }    
    type Query {
        attendanceByStudent(input:LessonIdInput!):Attendance!
        attendance(input:GetAttendanceInput!):Attendance!
        lessonAttendances(input:LessonIdInput!):[Attendance!]!
    }

    type Mutation {
        attendStudentByStudent(input: AttendStudentByStudentInput!): Attendance!
        attendStudentByAdmin(input: AttendStudentByAdminInput!): Attendance!
    }
`;
