export const userSchema: string = `#graphql

    type User {
        _id: String!
        firstName: String!
        lastName: String!
        phoneNumber: String!
        email: String!
        address: String!
        role: String!
        createdAt: String!
        updatedAt: String!
    }

    input CreateUserInput {
        firstName: String!
        lastName: String!
        phoneNumber: String!
        email: String!
        password: String!
        address: String!
        role: String!
    }

    input UpdateUserInput {
        firstName: String
        lastName: String
        phoneNumber: String
        email: String
        address: String
    }
    type Query {
        users: [User!]!
        user(_id: String!): User
    }

    type Mutation {
        createUser(input: CreateUserInput!): User!
        deleteUserById(_id: String!): Boolean!
        getUserById(_id: String!): User!
    }
`;
