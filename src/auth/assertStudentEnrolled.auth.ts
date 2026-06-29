import { Unauthorized } from "../error/business.error.js";
import { AttendStudentByStudentArgs } from "../graphql/interface/attendance.interface.graphql.js";
import {
  Context,
  CourseIdArgs,
  IdArgs,
} from "../graphql/interface/interface.graphql.js";
import { LessonIdArgs } from "../graphql/interface/lesson.interface.graphql.js";
import { isStudentIsCourseEnrolled } from "../service/enrollment.service.js";
import {
  getLessonById,
  isInstructorIsLessonCreator,
} from "../service/lesson.service.js";

export async function assertStudentEnrolled(
  args: CourseIdArgs | IdArgs | AttendStudentByStudentArgs | LessonIdArgs,
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
  } else if ("lessonId" in args.input) {
    _id = (await getLessonById(args.input.lessonId)).courseId.toString();
  }
  const isEnrolled = await isStudentIsCourseEnrolled(studentId, _id);
  if (!isEnrolled) {
    throw new Unauthorized();
  }
}
