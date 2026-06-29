import { graphqlRequest } from "../graphql-client.js";
import {
  CREATE_ASSIGNMENT,
  GET_ASSIGNMENT_OTP_BY_ID,
} from "../../graphql/operation/assignment.operation.graphql.js";
import { createRandomAssignment } from "../factory/assignment.factory.js";

export async function createAssignmentAndGetId(
  assignment: unknown,
  adminCookie: string,
) {
  const response = await graphqlRequest()
    .set("Cookie", adminCookie)
    .send({
      query: CREATE_ASSIGNMENT,
      variables: {
        input: assignment,
      },
    });
  return response.body.data.createAssignment._id;
}
export async function createRandomAssignmentAndGetId(
  courseId: string,
  adminCookie: string,
) {
  const assignment = createRandomAssignment(courseId);
  return await createAssignmentAndGetId(assignment, adminCookie);
}

export async function getAssignmentOTPById(
  assignmentId: string,
  adminCookie: string,
) {
  const response = await graphqlRequest()
    .set("Cookie", adminCookie)
    .send({
      query: GET_ASSIGNMENT_OTP_BY_ID,
      variables: {
        input: { _id: assignmentId },
      },
    });
  return response.body.data.assignmentOTP;
}
