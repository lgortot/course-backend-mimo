import { sqliteTable, text, integer, primaryKey, index } from "drizzle-orm/sqlite-core";
  
  // Table schemas

  export const Course = sqliteTable("Course", {
    ID: integer("ID").primaryKey({ autoIncrement: true }),
    Name: text("Name").notNull(),
  });
  
  export const Chapter = sqliteTable("Chapter", {
    ID: integer("ID").primaryKey({ autoIncrement: true }),
    Course_ID: integer("Course_ID").references(() => Course.ID, { onDelete: 'cascade' }),
    Name: text("Name").notNull(),
    Order_Index: integer("Order_Index").notNull().unique(),
  });
  
  export const Lesson = sqliteTable("Lesson", {
    ID: integer("ID").primaryKey({ autoIncrement: true }),
    Chapter_ID: integer("Chapter_ID").references(() => Chapter.ID, { onDelete: 'cascade' }),
    Name: text("Name").notNull(),
    Order_Index: integer("Order_Index").notNull().unique(),
  });
  
  export const User = sqliteTable("User", {
    ID: integer("ID").primaryKey({ autoIncrement: true }),
    Username: text("Username"),
  });
  
  export const User_Lesson_Progress = sqliteTable(
    "User_Lesson_Progress",
    {
      ID: integer("ID").primaryKey({ autoIncrement: true }),
      User_ID: integer("User_ID").references(() => User.ID, { onDelete: 'cascade' }), // will this delete user when i delete sqlite table?
      Lesson_ID: integer("Lesson_ID").references(() => Lesson.ID, { onDelete: 'cascade' }),
      Started_At: integer("Started_At", { mode: 'timestamp' }),
      Completed_At: integer("Completed_At", { mode: 'timestamp' }),
    },
    (table) => [
      index("idx_user_lesson_progress_user_lesson").on(table.User_ID, table.Lesson_ID),
    ]
  );
  
  export const Achievement = sqliteTable("Achievement", {
    ID: integer("ID").primaryKey({ autoIncrement: true }),
    Name: text("Name").notNull(),
    Type: text("Type").notNull(),
    Threshold: integer("Threshold"),
    Course_ID: integer("Course_ID").references(() => Course.ID, { onDelete: 'cascade' }),
  });
  
  export const User_Achievement = sqliteTable(
    "User_Achievement",
    {
      ID: integer("ID").primaryKey({ autoIncrement: true }),
      User_ID: integer("User_ID").references(() => User.ID, { onDelete: 'cascade' }),
      Achievement_ID: integer("Achievement_ID").references(() => Achievement.ID, { onDelete: 'cascade' }),
      Earned_At: integer("Earned_At", { mode: 'timestamp' }),
    },
    (table) => [
      index("idx_user_achievement_user_achievement").on(table.User_ID, table.Achievement_ID),
    ]
  );
  
  export const User_Chapter_Progress = sqliteTable(
    "User_Chapter_Progress",
    {
      User_ID: integer("User_ID").references(() => User.ID, { onDelete: 'cascade' }),
      Chapter_ID: integer("Chapter_ID").references(() => Chapter.ID, { onDelete: 'cascade' }),
    },
    (table) => [
      primaryKey({ columns: [table.User_ID, table.Chapter_ID] }),
    ]
  );
  
  export const User_Course_Progress = sqliteTable(
    "User_Course_Progress",
    {
      User_ID: integer("User_ID").references(() => User.ID, { onDelete: 'cascade' }),
      Course_ID: integer("Course_ID").references(() => Course.ID, { onDelete: 'cascade' }),
    },
    (table) => [
      primaryKey({ columns: [table.User_ID, table.Course_ID] }),
    ]
  );