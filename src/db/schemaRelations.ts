import * as Tables from './schemaTables';
import { relations } from 'drizzle-orm';

  // Relation schemas

  // Course ↔ Chapter (One-to-Many)
  export const courseRelations = relations(Tables.Course, ({ many }) => ({
    chapters: many(Tables.Chapter),
    achievements: many(Tables.Achievement),
    userCourseProgress: many(Tables.User_Course_Progress),
  }));
  
  export const chapterRelations = relations(Tables.Chapter, ({ one, many }) => ({
    course: one(Tables.Course, {
      fields: [Tables.Chapter.Course_ID],
      references: [Tables.Course.ID],
    }),
    lessons: many(Tables.Lesson),
    userChapterProgress: many(Tables.User_Chapter_Progress),
  }));
  
  // Chapter ↔ Lesson (One-to-Many)
  export const lessonRelations = relations(Tables.Lesson, ({ one, many }) => ({
    chapter: one(Tables.Chapter, {
      fields: [Tables.Lesson.Chapter_ID],
      references: [Tables.Chapter.ID],
    }),
    userLessonProgress: many(Tables.User_Lesson_Progress),
  }));
  
  // User ↔ User_Lesson_Progress, User_Achievement, User_Chapter_Progress, User_Course_Progress
  export const userRelations = relations(Tables.User, ({ many }) => ({
    userLessonProgress: many(Tables.User_Lesson_Progress),
    userAchievements: many(Tables.User_Achievement),
    userChapterProgress: many(Tables.User_Chapter_Progress),
    userCourseProgress: many(Tables.User_Course_Progress),
  }));
  
  // User_Lesson_Progress ↔ User, Lesson
  export const userLessonProgressRelations = relations(Tables.User_Lesson_Progress, ({ one }) => ({
    user: one(Tables.User, {
      fields: [Tables.User_Lesson_Progress.User_ID],
      references: [Tables.User.ID],
    }),
    lesson: one(Tables.Lesson, {
      fields: [Tables.User_Lesson_Progress.Lesson_ID],
      references: [Tables.Lesson.ID],
    }),
  }));
  
  // Achievement ↔ Course, User_Achievement
  export const achievementRelations = relations(Tables.Achievement, ({ one, many }) => ({
    course: one(Tables.Course, {
      fields: [Tables.Achievement.Course_ID],
      references: [Tables.Course.ID],
    }),
    userAchievements: many(Tables.User_Achievement),
  }));
  
  // User_Achievement ↔ User, Achievement
  export const userAchievementRelations = relations(Tables.User_Achievement, ({ one }) => ({
    user: one(Tables.User, {
      fields: [Tables.User_Achievement.User_ID],
      references: [Tables.User.ID],
    }),
    achievement: one(Tables.Achievement, {
      fields: [Tables.User_Achievement.Achievement_ID],
      references: [Tables.Achievement.ID],
    }),
  }));
  
  // User_Chapter_Progress ↔ User, Chapter
  export const userChapterProgressRelations = relations(Tables.User_Chapter_Progress, ({ one }) => ({
    user: one(Tables.User, {
      fields: [Tables.User_Chapter_Progress.User_ID],
      references: [Tables.User.ID],
    }),
    chapter: one(Tables.Chapter, {
      fields: [Tables.User_Chapter_Progress.Chapter_ID],
      references: [Tables.Chapter.ID],
    }),
  }));
  
  // User_Course_Progress ↔ User, Course
  export const userCourseProgressRelations = relations(Tables.User_Course_Progress, ({ one }) => ({
    user: one(Tables.User, {
      fields: [Tables.User_Course_Progress.User_ID],
      references: [Tables.User.ID],
    }),
    course: one(Tables.Course, {
      fields: [Tables.User_Course_Progress.Course_ID],
      references: [Tables.Course.ID],
    }),
  }));