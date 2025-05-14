import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import {
  Lesson,
  User,
  User_Chapter_Progress,
  User_Course_Progress,
  User_Lesson_Progress,
} from "./schemaTables";

/**
 * Drizzle User data model for SELECT operations.
 */
export type UserRow = InferSelectModel<typeof User>;
/**
 * Drizzle User data model for INSERT operations.
 */
export type NewUserRow = InferInsertModel<typeof User>;
/**
 * Drizzle User_Lesson_Progress data model for SELECT operations.
 */
export type UserLessonRow = InferSelectModel<typeof User_Lesson_Progress>;
/**
 * Drizzle User_Lesson_Progress data model for INSERT operations.
 */
export type NewUserLessonRow = InferInsertModel<typeof User_Lesson_Progress>;
/**
 * Drizzle Lesson data model for SELECT operations.
 */
export type LessonRow = InferSelectModel<typeof Lesson>;
/**
 * Drizzle User_Chapter_Progress data model for INSERT operations.
 */
export type NewUserChapterRow = InferInsertModel<typeof User_Chapter_Progress>;
/**
 * Drizzle User_Chapter_Progress data model for SELECT operations.
 */
export type UserChapterRow = InferSelectModel<typeof User_Chapter_Progress>;
/**
 * Drizzle User_Course_Progress data model for INSERT operations.
 */
export type NewUserCourseRow = InferInsertModel<typeof User_Course_Progress>;
/**
 * Drizzle User_Course_Progress data model for SELECT operations.
 */
export type UserCourseRow = InferSelectModel<typeof User_Course_Progress>;
