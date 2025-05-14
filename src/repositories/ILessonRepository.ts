import {
  ICourseChapterCount,
  IChapterLessonCount,
} from "../models/IMetaModels";
import { ILesson } from "../models/ILesson";
import { IUserLesson, IUserLessonWithCount } from "../models/IUserLesson";
import { IUserChapter, IUserChapterWithCount } from "../models/IUserChapter";
import { IUserCourse } from "../models/IUserCourse";

/**
 * Represents the repository for User-Lesson progress model database operations.
 *
 * Works with IUserLesson progress domain model abstraction to avoid being tightly-coupled to concrete implementation (e.g Drizzle ORM and Sqlite)
 */
export interface ILessonRepository {
  /**
   * Creates a new user-lesson progress entry in the database.
   *
   * @param userLesson - The user-lesson progress entity of the inserted user-lesson.
   * @returns an instance of inserted IUserLesson with total lessons finished by user under related chapter.
   */
  createUserLessonProgress(
    userLesson: IUserLesson
  ): Promise<IUserLessonWithCount>;

  /**
   * Creates a new user-chapter progress entry in the database.
   *
   * @param userChapter - The user-chapter progress entity of the inserted user-chapter.
   * @returns an instance of inserted IUserChapter with total chapters finished by user under related course.
   */
  createUserChapterProgress(
    userChapter: IUserChapter
  ): Promise<IUserChapterWithCount>;

  /**
   * Creates a new user-course progress entry in the database.
   *
   * @param userCourse - The user-course progress entity of the inserted user-course.
   * @returns an instance of inserted IUserCourse.
   */
  createUserCourseProgress(userCourse: IUserCourse): Promise<IUserCourse>;

  /**
   * Retrieves a single lesson by ID.
   *
   * @param id - The ID of the lesson to retrieve.
   */
  getById(id: number): Promise<ILesson | null>;

  /**
   * Retrieves a list of chapters count by course ID models.
   *
   */
  getChaptersCountByCourseIds(): Promise<ICourseChapterCount[] | null>;

  /**
   * Retrieves a list of lessons count by chapter ID models.
   *
   */
  getLessonsCountByChapterIds(): Promise<IChapterLessonCount[] | null>;
}
