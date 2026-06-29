import { Unauthorized } from "../error/business.error.js";
import { GetAttendanceArgs } from "../graphql/interface/attendance.interface.graphql.js";
import {
  Context,
  CourseIdArgs,
  IdArgs,
} from "../graphql/interface/interface.graphql.js";
import { LessonIdArgs } from "../graphql/interface/lesson.interface.graphql.js";
import { isInstructorIsLessonCreator } from "../service/lesson.service.js";

export async function assertLessonCreator(
  args: IdArgs | GetAttendanceArgs | LessonIdArgs,
  context: Context,
) {
  const role = context.req.session.role;
  if (role != "INSTRUCTOR") return;
  const instructorId = context.req.session.userId!;
  let _id: string = "";
  if ("_id" in args.input) {
    _id = args.input._id;
  } else if ("lessonId" in args.input) {
    _id = args.input.lessonId;
  }
  const isCreator = await isInstructorIsLessonCreator(instructorId, _id);
  if (!isCreator) {
    throw new Unauthorized();
  }
}
