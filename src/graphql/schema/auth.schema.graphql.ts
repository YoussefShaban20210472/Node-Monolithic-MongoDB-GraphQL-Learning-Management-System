export const authSchema: string = `#graphql
    input loginInput{
        email: String
        password: String
    }

    type Mutation {
        login(input: loginInput!): User!
        logout: Boolean!
    }
`;
