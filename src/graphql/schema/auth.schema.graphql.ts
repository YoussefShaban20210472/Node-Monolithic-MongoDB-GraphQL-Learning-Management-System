export const authSchema: string = `#graphql
    input LoginInput{
        email: String
        password: String
    }

    type Mutation {
        login(input: LoginInput!): User!
        logout: Boolean!
    }
`;
