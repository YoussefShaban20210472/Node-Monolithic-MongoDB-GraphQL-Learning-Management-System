import { Unauthorized } from "../error/business.error.js";
import { GetAttendanceArgs } from "../graphql/interface/attendance.interface.graphql.js";
import {
  Context,
  CourseIdArgs,
  IdArgs,
} from "../graphql/interface/interface.graphql.js";

import { isInstructorIsQuestionBankCreator } from "../service/questionBank.service.js";

export async function assertQuestionBankCreator(
  args: IdArgs,
  context: Context,
) {
  const role = context.req.session.role;
  if (role != "INSTRUCTOR") return;
  const instructorId = context.req.session.userId!;
  let _id: string = "";
  if ("_id" in args.input) {
    _id = args.input._id;
  }
  const isCreator = await isInstructorIsQuestionBankCreator(instructorId, _id);
  if (!isCreator) {
    throw new Unauthorized();
  }
}
