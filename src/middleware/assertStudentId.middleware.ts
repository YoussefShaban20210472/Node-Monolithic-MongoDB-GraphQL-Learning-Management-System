import {
  BadRequest,
  ObjectNotFound,
  Unauthorized,
} from "../error/business.error.js";
import { UpdateCourseByIdArgs } from "../graphql/interface/course.interface.graphql.js";
import { EnrollmentArgs } from "../graphql/interface/enrollment.interface.graphql.js";
import { Context, IdArgs } from "../graphql/interface/interface.graphql.js";
import { isUserIdHasCorrectRole } from "../service/user.service.js";

export async function assertStudentId(args: EnrollmentArgs, context: Context) {
  const role = context.req.session.role;
  if (role != "STUDENT") return;
  const studentId = args.input.studentId!;
  const isStudent = await isUserIdHasCorrectRole(studentId, "STUDENT");
  if (!isStudent) {
    throw new ObjectNotFound("studentId");
  }
}
