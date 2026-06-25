import { Unauthorized } from "../error/business.error.js";
import {
  Context,
  CourseIdArgs,
  IdArgs,
} from "../graphql/interface/interface.graphql.js";
import { isStudentIsCourseEnrolled } from "../service/enrollment.service.js";
import {
  getLessonById,
  isInstructorIsLessonCreator,
} from "../service/lesson.service.js";

export async function assertStudentEnrolled(
  args: CourseIdArgs | IdArgs,
  context: Context,
) {
  const role = context.req.session.role;
  if (role != "STUDENT") return;
  const studentId = context.req.session.userId!;
  let _id: string = "";
  if ("courseId" in args.input) {
    _id = args.input.courseId;
  } else if ("_id" in args.input) {
    _id = (await getLessonById(args.input._id)).courseId.toString();
  }
  const isEnrolled = await isStudentIsCourseEnrolled(studentId, _id);
  if (!isEnrolled) {
    throw new Unauthorized();
  }
}
