import { IAchievement } from "../models/IAchievement";

/**
 * Represents an abstract data cache interface.
 */
export interface IDataCache {
  /**
   * Gets the total number of chapters for course.
   * @param courseId - Course to check for.
   * @returns number of chapters or null if not found.
   */
  getChapterCountForCourse(courseId: number): number | undefined;
  /**
   * Sets the chapters count for course. Can be used for granular cache invalidation (ie one course gets a new chapter).
   * @param courseId - Course Id to set for.
   * @param count - Count of chapters for courseId.
   */
  setChapterCountForCourse(courseId: number, count: number): void;
  /**
   * Gets the total number of lessons for chapter.
   * @param chapterId - Chapter Id to check for.
   * @returns number of lessons or null if not found.
   */
  getLessonCountForChapter(chapterId: number): number | undefined;
  /**
   * Sets the chapters count for course. Can be used for granular cache invalidation (ie one chapter gets new lessons).
   * @param chapterId - Chapter Id to set for.
   * @param count - Count of lessons for chapterId.
   */
  setLessonCountForChapter(chapterId: number, count: number): void;
  /**
   * Gets the cached achievement of requested type and threshold.
   * @param type - Type of requested achievements.
   * @param threshold - Threshold of achievement objectives.
   */
  getAchievementByTypeAndThreshold(type: string, threshold: number): IAchievement | undefined;
  /**
   * Gets the cached achievement for requested course.
   * @param courseId - Type of requested achievements.
   */
   getAchievementByCourseId(courseId: number): IAchievement | undefined;
  /**
   * Runs cache initialization logic.
   */
  initializeCache(): Promise<void>;
}
