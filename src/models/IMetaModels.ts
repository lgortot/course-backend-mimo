// Meta-data domain models grouped in one file. They don' trepresent any resource 1-1 but are used as domain models for internal app functionality.
/**
 * Models Course - Chapters count data.
 */
export interface ICourseChapterCount {
  courseId: number;
  chapterCount: number;
}
/**
 * Models Chapter - Lessons count data.
 */
export interface IChapterLessonCount {
  chapterId: number;
  lessonCount: number;
}
