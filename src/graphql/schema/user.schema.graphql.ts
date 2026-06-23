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
    input _IdInput {
        _id: String!
    }

    input UpdateUserByIdInput {
        _id: String!
        firstName: String
        lastName: String
        phoneNumber: String
        email: String
        address: String
    }
    input UpdateMeInput {
        firstName: String
        lastName: String
        phoneNumber: String
        email: String
        address: String
    }
    type Query {
        users: [User!]!
        user(input: _IdInput!): User!
        me: User!
    }

    type Mutation {
        createUser(input: CreateUserInput!): User!
        deleteUserById(input: _IdInput!): Boolean!
        deleteMe: Boolean!        
        updateUserById(input: UpdateUserByIdInput!): Boolean!
        updateMe(input: UpdateMeInput!): Boolean!
    }
`;
