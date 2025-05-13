import { dbContext } from './dbContext'; // Adjust the import to where your Drizzle database instance is located
import { Course, Chapter, Lesson, User, Achievement, User_Lesson_Progress, User_Achievement } from './schemaTables'; // Adjust the import path

async function seed() {
  try {
    // Insert courses
    const courses = [
      { Name: 'Swift Course' },
      { Name: 'Javascript Course' },
      { Name: 'C# Course' }
    ];

    // Return the inserted course entities
    const insertedCourses = await Promise.all(
      courses.map(course =>
        dbContext.insert(Course).values(course).returning().then((res) => res[0].ID)
      )
    );

    // Insert chapters for each course
    const chapters = [
        { Course_ID: insertedCourses[0], Name: '1 - Getting Started with Swift', Order_Index: 1 },
        { Course_ID: insertedCourses[0], Name: '2 - Swift Basics: Data Types and Variables', Order_Index: 2 },
        { Course_ID: insertedCourses[0], Name: '3 - Building Your First Swift App', Order_Index: 3 },
      
        { Course_ID: insertedCourses[1], Name: '1 - JavaScript Fundamentals', Order_Index: 1 },
        { Course_ID: insertedCourses[1], Name: '2 - Control Flow in JavaScript', Order_Index: 2 },
        { Course_ID: insertedCourses[1], Name: '3 - Working with Functions and Objects in JavaScript', Order_Index: 3 },
        { Course_ID: insertedCourses[1], Name: '4 - Asynchronous JavaScript: Callbacks and Promises', Order_Index: 4 },
      
        { Course_ID: insertedCourses[2], Name: '1 - C# Basics: Syntax and Structure', Order_Index: 1 },
        { Course_ID: insertedCourses[2], Name: '2 - C# Data Types and Control Flow', Order_Index: 2 },
        { Course_ID: insertedCourses[2], Name: '3 - Object-Oriented Programming in C#', Order_Index: 3 }
      ];

    const insertedChapters = await Promise.all(
      chapters.map(chapter =>
        dbContext.insert(Chapter).values(chapter).returning().then((res) => res[0].ID)
      )
    );

    // Seed lessons

    const lessons = [
        // Swift - Chapter 1
        { Chapter_ID: insertedChapters[0], Name: 'Swift 1 - Lesson 1', Order_Index: 1 },
      
        // Swift - Chapter 2
        { Chapter_ID: insertedChapters[1], Name: 'Swift 2 - Lesson 1', Order_Index: 1 },
      
        // Swift - Chapter 3
        { Chapter_ID: insertedChapters[2], Name: 'Swift 3 - Lesson 1', Order_Index: 1 },
      
        // JavaScript - Chapter 1
        { Chapter_ID: insertedChapters[3], Name: 'JS 1 - Lesson 1', Order_Index: 1 },
        { Chapter_ID: insertedChapters[3], Name: 'JS 1 - Lesson 2', Order_Index: 2 },
        { Chapter_ID: insertedChapters[3], Name: 'JS 1 - Lesson 3', Order_Index: 3 },
      
        // JavaScript - Chapter 2
        { Chapter_ID: insertedChapters[4], Name: 'JS 2 - Lesson 1', Order_Index: 1 },
        { Chapter_ID: insertedChapters[4], Name: 'JS 2 - Lesson 2', Order_Index: 2 },
        { Chapter_ID: insertedChapters[4], Name: 'JS 2 - Lesson 3', Order_Index: 3 },
      
        // JavaScript - Chapter 3
        { Chapter_ID: insertedChapters[5], Name: 'JS 3 - Lesson 1', Order_Index: 1 },
        { Chapter_ID: insertedChapters[5], Name: 'JS 3 - Lesson 2', Order_Index: 2 },
        { Chapter_ID: insertedChapters[5], Name: 'JS 3 - Lesson 3', Order_Index: 3 },
      
        // JavaScript - Chapter 4
        { Chapter_ID: insertedChapters[6], Name: 'JS 4 - Lesson 1', Order_Index: 1 },
        { Chapter_ID: insertedChapters[6], Name: 'JS 4 - Lesson 2', Order_Index: 2 },
        { Chapter_ID: insertedChapters[6], Name: 'JS 4 - Lesson 3', Order_Index: 3 },
      
        // C# - Chapter 1
        { Chapter_ID: insertedChapters[7], Name: 'C# 1 - Lesson 1', Order_Index: 1 },
        { Chapter_ID: insertedChapters[7], Name: 'C# 1 - Lesson 2', Order_Index: 2 },
      
        // C# - Chapter 2
        { Chapter_ID: insertedChapters[8], Name: 'C# 2 - Lesson 1', Order_Index: 1 },
        { Chapter_ID: insertedChapters[8], Name: 'C# 2 - Lesson 2', Order_Index: 2 },
        { Chapter_ID: insertedChapters[8], Name: 'C# 2 - Lesson 3', Order_Index: 3 },
      
        // C# - Chapter 3
        { Chapter_ID: insertedChapters[9], Name: 'C# 3 - Lesson 1', Order_Index: 1 },
      ];

    // Insert lessons
    const insertedLessons = await Promise.all(
        lessons.map(lesson =>
          dbContext.insert(Lesson).values(lesson).returning().then((res) => res[0].ID)
        )
    );

    // Seed users
    const users = [
        { Username: 'mimo_user_1' },
        { Username: 'mimo_user_2' },
        { Username: 'mimo_user_3' }
      ];
    const insertedUsers = await Promise.all(
      users.map(user =>
        dbContext.insert(User).values(user).returning().then((res) => res[0].ID)
      )
    );

    // Seed Achievements
    const achievements = [
        { Name: 'Complete 5 lessons', Type: 'lesson', Threshold: 5, Course_ID: null },
        { Name: 'Complete 25 lessons', Type: 'lesson', Threshold: 25, Course_ID: null },
        { Name: 'Complete 50 lessons', Type: 'lesson', Threshold: 50, Course_ID: null },
        { Name: 'Complete 1 chapter', Type: 'chapter', Threshold: 1, Course_ID: null },
        { Name: 'Complete 5 chapters', Type: 'chapter', Threshold: 5, Course_ID: null },
        { Name: 'Complete the Swift course', Type: 'course', Threshold: 1, Course_ID: insertedCourses[0] },
        { Name: 'Complete the Javascript course', Type: 'course', Threshold: 1, Course_ID: insertedCourses[1] },
        { Name: 'Complete the C# course', Type: 'course', Threshold: 1, Course_ID: insertedCourses[2] },
      ];
    const insertedAchievements = await Promise.all(
        achievements.map(achievement =>
        dbContext.insert(Achievement).values(achievement).returning().then((res) => res[0].ID)
      )
    );

    // Setup Lesson progress data for testing purposes

    // User 3 has completed swift, first chapter from javascript course, and almost second chapter
    // Tip: Setup for getting 5 chapters achievement
    // Tip: Setup for getting javascript achievement
    const user3LessonProgress = insertedLessons.slice(0, 8).map( lesson => {
        return {
          User_ID: insertedUsers[2],
          Lesson_ID: lesson,
          Started_At: new Date(new Date('2025-01-01').getTime() + lesson * 1000000),
          Completed_At: new Date(new Date('2025-01-01').getTime() + (lesson + 1) * 1000000),
        };
    });
    await Promise.all(
        user3LessonProgress.map(progress => 
            dbContext.insert(User_Lesson_Progress).values(progress)
        )
    );

    // User 2 has 2/3 lessons from chapter 1 javascript and 1/2 lesson from chapter 1 c#
    // Tip: Setup for testing across different course chapters
    // Tip: Setup for achieving 5 lessons achievement fast
    const user2LessonProgress = [insertedLessons[3], insertedLessons[4], insertedLessons[15]].map(lesson => {
        return {
          User_ID: insertedUsers[1],
          Lesson_ID: lesson,
          Started_At: new Date(new Date('2025-01-01').getTime() + lesson * 2000000),
          Completed_At: new Date(new Date('2025-01-01').getTime() + (lesson + 1) * 2000000),
        };
    });
    await Promise.all(
        user2LessonProgress.map(progress => 
            dbContext.insert(User_Lesson_Progress).values(progress)
        )
    );

    // Seed Swift Achievement for user 3 for testing purposes (everything should be derived from User_Lesson_Progress table by app otherwise)
    const userAchievement = {
        User_ID: insertedUsers[2],
        Achievement_ID: insertedAchievements[5],
        Earned_At: new Date('2025-01-01')
    };
  
  // Insert user achievement
  await dbContext.insert(User_Achievement).values(userAchievement);

    console.log('Database has been seeded!');
  } catch (error) {
    console.error('Error seeding the database:', error);
  }
}

// Run the seeding function
seed();
