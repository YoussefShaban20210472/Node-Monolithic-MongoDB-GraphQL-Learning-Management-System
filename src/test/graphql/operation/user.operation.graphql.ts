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
      query GetUserById($input: String!) {
        user(_id: $input) {
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
export const GET_ALL_USERS = `
      query GetAllUsers {
        users {
          _id
          firstName
          lastName
          email
          address
          role
        }
      }
    `;

export const GET_ME = `
      query GetMe {
        me {
          _id
          firstName
          lastName
          email
          address
          role
        }
      }
    `;
export const DELETE_ME = `
      mutation DeleteMe {
        deleteMe
      }
    `;
export const UPDATE_ME = `
      mutation UpdateMe($input: UpdateMeInput!) {
        updateMe(input: $input)
      }
    `;
export const UPDATE_USER_BY_ID = `
      mutation UpdateUserById($input: UpdateUserByIdInput!) {
        updateUserById(input: $input)
      }
    `;
