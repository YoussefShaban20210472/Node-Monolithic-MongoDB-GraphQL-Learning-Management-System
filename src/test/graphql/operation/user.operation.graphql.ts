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
export const GET_USER_BY_ID = `
      mutation GetUserById($input: String!) {
        getUserById(_id: $input) {
          _id
          firstName
          lastName
          email
          address
          role
        }
      }
    `;
export const DELETE_USER_BY_ID = `
      mutation DeleteUserById($input: String!) {
        deleteUserById(_id: $input)
      }
    `;
