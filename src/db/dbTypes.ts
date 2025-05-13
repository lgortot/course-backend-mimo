import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { Lesson, User, User_Lesson_Progress } from "./schemaTables";

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
export type LessonRow = InferSelectModel<typeof Lesson>