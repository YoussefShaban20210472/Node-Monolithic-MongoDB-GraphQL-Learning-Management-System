import * as enrollmentRepository from "../repository/enrollment.repository.js";

import Enrollment from "../model/enrollment.model.js";
import {
  enrollmentSchema,
  updateEnrollmentSchema,
} from "../validator/enrollment.validator.js";
import { Confilct, ObjectNotFound } from "../error/business.error.js";

export async function isStudentIsCourseEnrolled(
  studentId: string,
  courseId: string,
) {
  const enrollment = await enrollmentRepository.getEnrollment({
    courseId,
    studentId,
  });
  if (enrollment == null) {
    return false;
  }
  return enrollment.status === "ACCEPTED";
}
export async function enrollStudent(enrollment: Enrollment) {
  enrollmentSchema.parse(enrollment);

  const result = await enrollmentRepository.enrollStudent(enrollment);
  return result;
}
export async function getEnrollment(enrollment: Enrollment) {
  enrollmentSchema.parse(enrollment);
  const result = await enrollmentRepository.getEnrollment(enrollment);
  if (result == null) {
    throw new ObjectNotFound("Enrollment");
  }
  return result;
}

export async function deleteEnrollment(enrollment: Enrollment) {
  const enroll = await getEnrollment(enrollment);
  if (enroll?.status !== "PENDING") {
    throw new Confilct(
      "You can't uneroll from the course after the instructor confirmed your enrollment request",
    );
  }
  const result = await enrollmentRepository.deleteEnrollment(enrollment);
  return result;
}

export async function updateEnrollment(enrollment: Enrollment) {
  updateEnrollmentSchema.parse(enrollment);
  const result = await enrollmentRepository.updateEnrollment(enrollment);
  if (!result) {
    throw new ObjectNotFound("Enrollment");
  }
  return result;
}
