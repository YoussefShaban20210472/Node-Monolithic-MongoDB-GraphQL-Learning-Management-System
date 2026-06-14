import "../../bootstrap.js";
import request from "supertest";
import app from "../../app.js";
export const graphqlRequest = () => {
  return request(app).post("/graphql");
};
