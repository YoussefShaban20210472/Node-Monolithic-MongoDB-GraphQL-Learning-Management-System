export interface CreateLessonInput {
  title: string;
  courseId: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface UpdateLessonByIdInput {
  _id: string;
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}
export interface LessonIdInput {
  lessonId: string;
}
export interface CreateLessonArgs {
  input: CreateLessonInput;
}

export interface UpdateLessonByIdArgs {
  input: UpdateLessonByIdInput;
}
export interface LessonIdArgs {
  input: LessonIdInput;
}
