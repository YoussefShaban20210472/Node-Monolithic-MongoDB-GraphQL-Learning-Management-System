export const LOGIN = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      _id
      firstName
      lastName
      email
      address
      role
    }
  }
`;

export const LOGOUT = `
  mutation {
    logout
  }
`;
