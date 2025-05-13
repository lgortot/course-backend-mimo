import { ILesson } from "../models/ILesson";
import { IUserLesson } from "../models/IUserLesson";

/**
 * Represents the repository for User-Lesson progress model database operations.
 *
 * Works with IUserLesson progress domain model abstraction to avoid being tightly-coupled to concrete implementation (e.g Drizzle ORM and Sqlite)
 */
export interface ILessonRepository {
  /**
   * Creates a new user-lesson progress entry in the database.
   *
   * @param user - The user-lesson progress entity of the inserted user-lesson.
   */
  createUserLessonProgress(userLesson: IUserLesson): Promise<IUserLesson>;

  /**
   * Retrieves a single lesson by ID.
   *
   * @param id - The ID of the lesson to retrieve.
   */
  getById(id: number): Promise<ILesson | null>;
}
