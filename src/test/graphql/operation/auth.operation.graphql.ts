export const LOGIN = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      _id
      firstName
      lastName
      email
    }
  }
`;

export const LOGOUT = `
  mutation {
    logout
  }
`;
