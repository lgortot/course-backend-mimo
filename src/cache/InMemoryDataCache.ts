import { IAchievement } from "../models/IAchievement";
import { DrizzleAchievementRepository } from "../repositories/DrizzleAchievementRepository";
import { DrizzleLessonRepository } from "../repositories/DrizzleLessonRepository";
import { IDataCache } from "./IDataCache";

/**
 * In-memory implementation of data cache for demo purposes.
 */
export class InMemoryDataCache implements IDataCache {
  constructor(
    private readonly lessonRepository: DrizzleLessonRepository,
    private readonly achievementRepository: DrizzleAchievementRepository
  ) {}
  private courseChapterCount = new Map<number, number>();
  private chapterLessonCount = new Map<number, number>();
  private achievementsCache: IAchievement[] = []; // should not contain entire object, just necessary information to minimize RAM consumption.

  getChapterCountForCourse(courseId: number): number | undefined {
    return this.courseChapterCount.get(courseId);
  }

  setChapterCountForCourse(courseId: number, count: number): void {
    console.log(`New Cache entry: [Course ${courseId} - ${count} chapters]`);
    this.courseChapterCount.set(courseId, count);
  }

  getLessonCountForChapter(chapterId: number): number | undefined {
    return this.chapterLessonCount.get(chapterId);
  }

  setLessonCountForChapter(chapterId: number, count: number): void {
    console.log(`New Cache entry: [Chapter ${chapterId} - ${count} lessons]`);
    this.chapterLessonCount.set(chapterId, count);
  }

  getAchievementByTypeAndThreshold(type: string, threshold: number): IAchievement | undefined {
    return this.achievementsCache.find(
      (achievement) => achievement.Type === type && achievement.Threshold == threshold
    );
  }

  getAchievementByCourseId(courseId: number): IAchievement | undefined {
    return this.achievementsCache.find(
      (achievement) => achievement.Course_ID === courseId);
  }

  async initializeCache(): Promise<void> {
    this.courseChapterCount.clear();
    this.chapterLessonCount.clear();
    const courseChapters =
      await this.lessonRepository.getChaptersCountByCourseIds();
    const chapterLessons =
      await this.lessonRepository.getLessonsCountByChapterIds();
    const achievements = 
      await this.achievementRepository.getAllAchievements();
    if (courseChapters == null || chapterLessons == null || achievements == null) {
      throw new Error("Unable to initialize cache. Missing seed data.");
    }
    for (const { courseId, chapterCount } of courseChapters) {
      this.setChapterCountForCourse(courseId, chapterCount);
    }
    for (const { chapterId, lessonCount } of chapterLessons) {
      this.setLessonCountForChapter(chapterId, lessonCount);
    }
    this.achievementsCache = achievements;
    console.log(`Cached ${achievements.length} achievements`);
  }
}
