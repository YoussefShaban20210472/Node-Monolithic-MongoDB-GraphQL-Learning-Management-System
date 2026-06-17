import { graphqlRequest } from "../graphql-client.js";
import { LOGIN } from "../../graphql/operation/auth.operation.graphql.js";
import { createRandomUser } from "../factory/user.factory.js";
import {
  CREATE_USER,
  GET_ME,
} from "../../graphql/operation/user.operation.graphql.js";
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
  return await createUserAndGetId(user, adminCookie);
}

export async function createUserAndLoginAndGetCookie(
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
  await createUserAndGetId(user, adminCookie);
  return await loginAndGetCookie({
    email: user.email,
    password: user.password,
  });
}
export async function createRandomUserAndLoginAndGetCookie(
  role: string,
  adminCookie: string,
) {
  const user = createRandomUser(role);
  return await createUserAndLoginAndGetCookie(user, adminCookie);
}

export async function getUserId(userCookie: string) {
  const response = await graphqlRequest()
    .set("Cookie", userCookie)
    .send({
      query: GET_ME,
      variables: {
        input: undefined,
      },
    });
  return response.body.data.me._id;
}
