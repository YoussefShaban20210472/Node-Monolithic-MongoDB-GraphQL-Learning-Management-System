import { Unauthorized } from "../error/business.error.js";
import { GetAttendanceArgs } from "../graphql/interface/attendance.interface.graphql.js";
import {
  Context,
  CourseIdArgs,
  IdArgs,
} from "../graphql/interface/interface.graphql.js";
import { AssignmentIdArgs } from "../graphql/interface/assignment.interface.graphql.js";
import { isInstructorIsAssignmentCreator } from "../service/assignment.service.js";
import { UpdateEnrollmentArgs } from "../graphql/interface/enrollment.interface.graphql.js";
import {
  CreateLessonArgs,
  LessonIdArgs,
} from "../graphql/interface/lesson.interface.graphql.js";
import { isInstructorIsCourseCreator } from "../service/course.service.js";
import { isInstructorIsLessonCreator } from "../service/lesson.service.js";
import { isInstructorIsQuestionBankCreator } from "../service/questionBank.service.js";
import { isInstructorIsQuizCreator } from "../service/quiz.service.js";
import { QuizIdArgs } from "../graphql/interface/quiz.interface.graphql.js";

export async function assertInstructorCreatorByCourse(
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
export async function assertInstructorCreatorByLesson(
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
export async function assertInstructorCreatorByAssignment(
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

export async function assertInstructorCreatorByQuestionBank(
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
export async function assertInstructorCreatorByQuiz(
  args: IdArgs | QuizIdArgs,
  context: Context,
) {
  const role = context.req.session.role;
  if (role != "INSTRUCTOR") return;
  const instructorId = context.req.session.userId!;
  let _id: string = "";
  if ("_id" in args.input) {
    _id = args.input._id;
  } else if ("quizId" in args.input) {
    _id = args.input.quizId;
  }
  const isCreator = await isInstructorIsQuizCreator(instructorId, _id);
  if (!isCreator) {
    throw new Unauthorized();
  }
}
