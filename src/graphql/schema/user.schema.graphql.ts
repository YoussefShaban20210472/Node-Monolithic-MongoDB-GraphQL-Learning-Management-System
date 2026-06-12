export const userSchema: string = `#graphql

    enum UserRole {
        STUDENT
        INSTRUCTOR
        ADMIN
    }

    type User {
        _id: ID!
        firstName: String!
        lastName: String!
        phoneNumber: String!
        email: String!
        address: String!
        role: UserRole!
        createdAt: String!
        updatedAt: String
    }

    input CreateUserInput {
        firstName: String!
        lastName: String!
        phoneNumber: String!
        email: String!
        password: String!
        address: String!
        role: UserRole = STUDENT
    }

    input UpdateUserInput {
        firstName: String
        lastName: String
        phoneNumber: String
        email: String
        address: String
    }
    input loginInput{
        email: String
        password: String
    }

    type Query {
        users: [User!]!
        user(_id: ID!): User
    }

    type Mutation {
        createUser(input: CreateUserInput!): User!
        login(input: loginInput!): User!
    }
`;
