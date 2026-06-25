import { Unauthorized } from "../error/business.error.js";
import { UpdateCourseByIdArgs } from "../graphql/interface/course.interface.graphql.js";
import { UpdateEnrollmentArgs } from "../graphql/interface/enrollment.interface.graphql.js";
import {
  Context,
  CourseIdArgs,
  IdArgs,
} from "../graphql/interface/interface.graphql.js";
import { CreateLessonArgs } from "../graphql/interface/lesson.interface.graphql.js";
import { isInstructorIsCourseCreator } from "../service/course.service.js";

export async function assertCourseCreator(
  args: IdArgs | UpdateEnrollmentArgs | CreateLessonArgs | CourseIdArgs,
  context: Context,
) {
  const role = context.req.session.role;
  if (role != "INSTRUCTOR") return;
  const instructorId = context.req.session.userId!;
  let _id: string;
  if ("_id" in args.input) {
    _id = args.input._id;
  } else {
    _id = args.input.courseId;
  }
  const isCreator = await isInstructorIsCourseCreator(instructorId, _id);
  if (!isCreator) {
    throw new Unauthorized();
  }
}
