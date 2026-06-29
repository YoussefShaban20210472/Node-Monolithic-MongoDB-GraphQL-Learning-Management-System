import { Unauthorized } from "../error/business.error.js";
import { GetAttendanceArgs } from "../graphql/interface/attendance.interface.graphql.js";
import { Context, IdArgs } from "../graphql/interface/interface.graphql.js";
import { AssignmentIdArgs } from "../graphql/interface/assignment.interface.graphql.js";
import { isInstructorIsAssignmentCreator } from "../service/assignment.service.js";

export async function assertAssignmentCreator(
  args: IdArgs | GetAttendanceArgs | AssignmentIdArgs,
  context: Context,
) {
  const role = context.req.session.role;
  if (role != "INSTRUCTOR") return;
  const instructorId = context.req.session.userId!;
  let _id: string = "";
  if ("_id" in args.input) {
    _id = args.input._id;
  } else if ("assignmentId" in args.input) {
    _id = args.input.assignmentId;
  }
  const isCreator = await isInstructorIsAssignmentCreator(instructorId, _id);
  if (!isCreator) {
    throw new Unauthorized();
  }
}
