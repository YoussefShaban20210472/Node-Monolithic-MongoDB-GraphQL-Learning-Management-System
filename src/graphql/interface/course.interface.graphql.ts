import { ObjectId } from "mongodb";

export interface CourseGraphql {
  _id?: ObjectId | string;
  title: string;
  description: string;
  shortDescription: string;
  instructorId: ObjectId | string;
  startDate: string;
  endDate: string;
  tags: string[];
  categories: string[];
}
export interface CreateCourseByInstructorInput {
  title: string;
  description: string;
  shortDescription: string;
  startDate: string;
  endDate: string;
  tags: string[];
  categories: string[];
}
export interface CreateCourseByAdminInput {
  title: string;
  description: string;
  shortDescription: string;
  instructorId: string;
  startDate: string;
  endDate: string;
  tags: string[];
  categories: string[];
}

export interface UpdateCourseByIdInput {
  _id: string;
  title?: string;
  description?: string;
  shortDescription?: string;
  startDate?: string;
  endDate?: string;
  tags?: string[];
  categories?: string[];
}
export interface CreateCourseByInstructorArgs {
  input: CreateCourseByInstructorInput;
}
export interface CreateCourseByAdminArgs {
  input: CreateCourseByAdminInput;
}
export interface UpdateCourseByIdArgs {
  input: UpdateCourseByIdInput;
}
