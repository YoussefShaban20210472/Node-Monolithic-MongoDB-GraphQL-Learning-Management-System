export const CREATE_USER = `
      mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
          _id
          firstName
          lastName
          email
          address
          role
        }
      }
    `;
