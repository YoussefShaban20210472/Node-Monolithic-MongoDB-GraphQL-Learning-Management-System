import { graphqlRequest } from "../graphql-client.js";
import { LOGIN } from "../../graphql/operation/auth.operation.graphql.js";
import { createRandomUser } from "../factory/user.factory.js";
import { CREATE_USER } from "../../graphql/operation/user.operation.graphql.js";
import { adminLogin } from "../../graphql/fixture/user.fixture.graphql.js";
export async function loginAndGetCookie(account: {
  email?: string;
  password?: string;
}) {
  const response = await graphqlRequest().send({
    query: LOGIN,
    variables: {
      input: account,
    },
  });
  return response.headers["set-cookie"];
}

export async function createUserAndGetId(
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    address: string;
    role: string;
  },
  adminCookie: string,
) {
  const response = await graphqlRequest()
    .set("Cookie", adminCookie)
    .send({
      query: CREATE_USER,
      variables: {
        input: user,
      },
    });
  return response.body.data.createUser._id;
}
export async function createRandomUserAndGetId(
  role: string,
  adminCookie: string,
) {
  const user = createRandomUser(role);
  return createUserAndGetId(user, adminCookie);
}
