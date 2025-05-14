import { ILessonRepository } from "./ILessonRepository";
import { LessonRow, NewUserChapterRow, NewUserCourseRow, NewUserLessonRow, UserChapterRow, UserCourseRow, UserLessonRow } from "../db/dbTypes";
import { IUserLesson, IUserLessonWithCount } from "../models/IUserLesson";
import { Chapter, Lesson, User_Chapter_Progress, User_Course_Progress, User_Lesson_Progress } from "../db/schemaTables";
import { InternalServerError } from "../errors/ApiErrors";
import { dbContext } from "../db/dbContext";
import { ILesson } from "../models/ILesson";
import { eq, sql } from "drizzle-orm";
import {
  ICourseChapterCount,
  IChapterLessonCount,
} from "../models/IMetaModels";
import { IUserChapter, IUserChapterWithCount } from "../models/IUserChapter";
import { IUserCourse } from "../models/IUserCourse";

/**
 * Drizzle ORM + SQLite implementation of the Lesson resource repository.
 */
export class DrizzleLessonRepository implements ILessonRepository {
  async createUserLessonProgress(
    userLesson: IUserLesson
  ): Promise<IUserLessonWithCount> {
    const newUserLesson: NewUserLessonRow = {
      Lesson_ID: userLesson.lesson_id,
      User_ID: userLesson.user_id,
      Completed_At: userLesson.Completed_At,
      Started_At: userLesson.Started_At,
    };

    try {
      // Execute within a transaction for atomic insert + count.
      // I tried to make a CTE subquery for performance benefits by skipping multiple trips to database but couldn't get it to work with drizzle+sqlite.
      // A transaction skips sqlite's disk sync safety mechanism by grouping everything in one [BEGIN ... COMMIT] block.
      // So there is a performance benefit on top of the safety mechanism a transaction provides.
      const result: IUserLessonWithCount = dbContext.transaction((tx) => {
        // Insert the new progress row
        const insertedProgressRow = tx
          .insert(User_Lesson_Progress)
          .values(newUserLesson)
          .returning()
          .get();

        // Get the Chapter_ID of the inserted lesson
        const relatedRowWithParentId = tx
          .select({
            Chapter_ID: Lesson.Chapter_ID,
          })
          .from(Lesson)
          .where(eq(Lesson.ID, newUserLesson.Lesson_ID))
          .get();

        if (!relatedRowWithParentId?.Chapter_ID) {
          throw new InternalServerError(
            "Lesson or Chapter_ID not found for the inserted progress entry."
          );
        }

        // Count User_Lesson_Progress rows for the user in the same chapter
        const countResult = tx
          .select({
            totalForUser: sql<number>`
            COUNT(DISTINCT ${User_Lesson_Progress.Lesson_ID} || '-' || ${User_Lesson_Progress.User_ID})
          `.as("totalForUser"),
          })
          .from(User_Lesson_Progress)
          .innerJoin(Lesson, eq(User_Lesson_Progress.Lesson_ID, Lesson.ID))
          .where(
            sql`${User_Lesson_Progress.User_ID} = ${newUserLesson.User_ID} AND ${Lesson.Chapter_ID} = ${relatedRowWithParentId.Chapter_ID}`
          )
          .get();

        return {
          inserted: this.userLessontoDomain(insertedProgressRow as UserLessonRow),
          chapter_Id: relatedRowWithParentId.Chapter_ID,
          lessonCount: countResult?.totalForUser ?? 0,
        };
      });

      return result;
    } catch (error) {
      console.error("Error:", error);
      throw new InternalServerError("Failed to connect to database.");
    }
  }

  async createUserChapterProgress(
    userChapter: IUserChapter
  ): Promise<IUserChapterWithCount> {
    const newUserChapter: NewUserChapterRow = {
      Chapter_ID: userChapter.chapter_id,
      User_ID: userChapter.user_id,
    };

    try {
      const result: IUserChapterWithCount = dbContext.transaction((tx) => {
        // Insert the new progress row
        const insertedProgressRow = tx
          .insert(User_Chapter_Progress)
          .values(newUserChapter)
          .returning()
          .get();

        // Get the Course_ID of the inserted lesson
        const relatedRowWithParentId = tx
          .select({
            Course_ID: Chapter.Course_ID,
          })
          .from(Chapter)
          .where(eq(Chapter.ID, newUserChapter.Chapter_ID))
          .get();

        if (!relatedRowWithParentId?.Course_ID) {
          throw new InternalServerError(
            "Related Chapter or it's Course_ID not found for the inserted progress entry."
          );
        }

        // Count User_Chapter_Progress rows for the user in the same course
        const countResult = tx
          .select({
            totalForUser: sql<number>`
            COUNT(*)
          `.as("totalForUser"),
          })
          .from(User_Chapter_Progress)
          .innerJoin(Chapter, eq(User_Chapter_Progress.Chapter_ID, Chapter.ID))
          .where(
            sql`${User_Chapter_Progress.User_ID} = ${newUserChapter.User_ID} AND ${Chapter.Course_ID} = ${relatedRowWithParentId.Course_ID}`
          )
          .get();

        return {
          inserted: this.userChaptertoDomain(insertedProgressRow as UserChapterRow),
          course_id: relatedRowWithParentId.Course_ID,
          chapterCount: countResult?.totalForUser ?? 0,
        };
      });

      return result;
    } catch (error) {
      console.error("Error:", error);
      throw new InternalServerError("Failed to connect to database.");
    }
  }

  async createUserCourseProgress(
    userCourse: IUserCourse
  ): Promise<IUserCourse> {
    const newUserCourse: NewUserCourseRow = {
      Course_ID: userCourse.course_id,
      User_ID: userCourse.user_id,
    };
    try {
      const [inserted] = await dbContext
        .insert(User_Course_Progress)
        .values(newUserCourse)
        .returning();
      return this.userCoursetoDomain(inserted);
    } catch (error) {
      console.error("Error:", error);
      throw new InternalServerError("Failed to connect to database.");
    }
  }

  async getById(id: number): Promise<ILesson | null> {
    try {
      const rows = await dbContext
        .select()
        .from(Lesson)
        .where(eq(Lesson.ID, id));
      return rows[0] ? this.lessonToDomain(rows[0]) : null;
    } catch (error) {
      console.error("Error:", error);
      throw new InternalServerError("Failed to connect to database.");
    }
  }

  async getChaptersCountByCourseIds(): Promise<ICourseChapterCount[] | null> {
    try {
      const chapterCounts = (await dbContext
        .select({
          courseId: Chapter.Course_ID,
          chapterCount: sql<number>`count(${Chapter.ID})`.as("chapterCount"),
        })
        .from(Chapter)
        .groupBy(Chapter.Course_ID)
        .all()) as ICourseChapterCount[];
      return chapterCounts.length > 0 ? chapterCounts : null;
    } catch (error) {
      console.error("Error:", error);
      throw new InternalServerError("Failed to connect to database.");
    }
  }

  async getLessonsCountByChapterIds(): Promise<IChapterLessonCount[] | null> {
    try {
      const lessonCounts = (await dbContext
        .select({
          chapterId: Lesson.Chapter_ID,
          lessonCount: sql<number>`count(${Lesson.ID})`.as("lessonCount"),
        })
        .from(Lesson)
        .groupBy(Lesson.Chapter_ID)
        .all()) as IChapterLessonCount[];
      return lessonCounts.length > 0 ? lessonCounts : null;
    } catch (error) {
      console.error("Error:", error);
      throw new InternalServerError("Failed to connect to database.");
    }
  }

  /**
   * Transforms Database Lesson model to domain model.
   *
   * @param row - Model of Lesson row data from database.
   * @returns ILesson domain model of Lesson row data from database.
   */
  private lessonToDomain(row: LessonRow): ILesson {
    return {
      ID: row.ID,
      Chapter_ID: row.Chapter_ID,
      Name: row.Name,
      Order_Index: row.Order_Index,
    };
  }

  /**
   * Transforms Database User-Lesson progress model to domain model.
   *
   * @param row - Model of User-Lesson progress row data from database.
   * @returns IUserLesson domain model of User-Lesson progress row data from database.
   */
  private userLessontoDomain(row: UserLessonRow): IUserLesson {
    return {
      id: row.ID,
      user_id: row.User_ID,
      lesson_id: row.Lesson_ID,
      Started_At: row.Started_At,
      Completed_At: row.Completed_At,
    };
  }

  /**
   * Transforms Database User-Chapter progress model to domain model.
   *
   * @param row - Model of User-Chapter progress row data from database.
   * @returns IUserChapter domain model of User-Chapter progress row data from database.
   */
   private userChaptertoDomain(row: UserChapterRow): IUserChapter {
    return {
      user_id: row.User_ID,
      chapter_id: row.Chapter_ID,
    };
  }

  /**
   * Transforms Database User-Course progress model to domain model.
   *
   * @param row - Model of User-Course progress row data from database.
   * @returns IUserCourse domain model of User-Course progress row data from database.
   */
   private userCoursetoDomain(row: UserCourseRow): IUserCourse {
    return {
      user_id: row.User_ID,
      course_id: row.Course_ID,
    };
  }
}
