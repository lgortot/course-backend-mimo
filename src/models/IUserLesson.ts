import { z } from "zod";

/**
 * Domain User-Lesson progress model to be used with repository abstraction.
 */
export interface IUserLesson {
  id: number | undefined;
  user_id: number;
  lesson_id: number;
  Started_At: Date;
  Completed_At: Date;
}

/**
 * Domain User-Lesson progress model containing total lessons user has completed under a chapter. (TODO: Reuse medamodel for counts)
 */
export interface IUserLessonWithCount {
  inserted: IUserLesson,
  chapter_Id: number,
  lessonCount: number,
  lessonCountOverall: number
}

/**
 * Zod schema for User-Lesson progress upsert operations.
 * - `username` is mandatory and must be non-empty, hence "min 1"
 */
export const userLessonUpsertSchema = z.object({
  lesson_id: z.number().int().positive(),
  started_at: z.coerce.date(),
  completed_at: z.coerce.date(),
});

/**
 * TypeScript DTO inferred from Zod schema
 */
export type UserLessonUpsertDto = z.infer<typeof userLessonUpsertSchema>;
