import { graphqlRequest } from "../graphql-client.js";
import { LOGIN } from "../../graphql/operation/auth.operation.graphql.js";
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
