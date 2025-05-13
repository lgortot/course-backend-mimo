import { ILessonRepository } from "./ILessonRepository";
import { LessonRow, NewUserLessonRow, UserLessonRow } from "../db/dbTypes";
import { IUserLesson } from "../models/IUserLesson";
import { Lesson, User_Lesson_Progress } from "../db/schemaTables";
import { InternalServerError } from "../errors/ApiErrors";
import { dbContext } from "../db/dbContext";
import { ILesson } from "../models/ILesson";
import { eq } from "drizzle-orm";

/**
 * Drizzle ORM + SQLite implementation of the Lesson resource repository.
 */
export class DrizzleLessonRepository implements ILessonRepository {
  async createUserLessonProgress(
    userLesson: IUserLesson
  ): Promise<IUserLesson> {
    const newUserLesson: NewUserLessonRow = {
      Lesson_ID: userLesson.lesson_id,
      User_ID: userLesson.user_id,
      Completed_At: userLesson.Completed_At,
      Started_At: userLesson.Started_At,
    };

    try {
      const [inserted] = await dbContext
        .insert(User_Lesson_Progress)
        .values(newUserLesson)
        .returning();
      return this.userLessontoDomain(inserted);
    } catch (error) {
      console.error("Error:", error);
      throw new InternalServerError("Failed to connect to database.");
    }
  }

  async getById(id: number): Promise<ILesson | null> {
    try {
      const rows = await dbContext.select().from(Lesson).where(eq(Lesson.ID, id));
      return rows[0] ? this.lessonToDomain(rows[0]) : null;
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
}
