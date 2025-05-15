/**
 * Domain User-Chapter progress model to be used with repository abstraction.
 */
export interface IUserChapter {
  user_id: number;
  chapter_id: number;
}
/**
 * Domain User-Chapter progress model containing total chapters user has completed under a course.
 */
 export interface IUserChapterWithCount {
    inserted: IUserChapter,
    course_id: number,
    chapterCount: number,
    chapterCountOverall: number
  }