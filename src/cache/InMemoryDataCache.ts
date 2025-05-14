import { DrizzleLessonRepository } from "../repositories/DrizzleLessonRepository";
import { IDataCache } from "./IDataCache";

/**
 * In-memory implementation of data cache for demo purposes.
 */
export class InMemoryDataCache implements IDataCache {
  constructor(private readonly lessonRepository: DrizzleLessonRepository) {}
  private courseChapterCount = new Map<number, number>();
  private chapterLessonCount = new Map<number, number>();

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

  async initializeCache(): Promise<void> {
    this.courseChapterCount.clear();
    this.chapterLessonCount.clear();
    const courseChapters = await this.lessonRepository.getChaptersCountByCourseIds();
    const chapterLessons = await this.lessonRepository.getLessonsCountByChapterIds();
    if (courseChapters == null || chapterLessons == null)
    {
        throw new Error("Unable to initialize cache. Missing seed data.");
    }
    for (const { courseId, chapterCount } of courseChapters) {
      this.setChapterCountForCourse(courseId, chapterCount);
    }
    for (const { chapterId, lessonCount } of chapterLessons) {
      this.setLessonCountForChapter(chapterId, lessonCount);
    }
  }
}
