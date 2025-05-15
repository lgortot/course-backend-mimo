import { ILessonRepository } from "../repositories/ILessonRepository";
import { NotFoundError } from "../errors/ApiErrors";
import { IUser, UserUpsertDto } from "../models/IUser";
import { IUserRepository } from "../repositories/IUserRepository";
import { IUserLesson, UserLessonUpsertDto } from "../models/IUserLesson";
import { IDataCache } from "../cache/IDataCache";
import { IUserChapter } from "../models/IUserChapter";
import { IUserCourse } from "../models/IUserCourse";
import { IAchievementRepository } from "../repositories/IAchievementRepository";
import {
  IUserAchievement,
  UserAchievementDto,
} from "../models/IUserAchievement";

/**
 * Service layer for handling business logic related to User resource operations.
 *
 */
export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly lessonRepository: ILessonRepository,
    private readonly achievementRepository: IAchievementRepository,
    private readonly cache: IDataCache
  ) {}

  /**
   * Gets all achievements for user.
   *
   * @param userId - The ID of the user.
   * @throws Will throw if no achievements are found in database.
   * @returns A list of all earned and unearned achievements.
   */
  async getAchievementsForUser(userId: number): Promise<UserAchievementDto[]> {
    const achievements =
      await this.achievementRepository.getAllUserAchievementProgress(userId);
    if (!achievements) {
      throw new NotFoundError(
        "There are no achievements registered in the database."
      );
    }

    const shouldGetLessons = achievements.some(
      (a) => a.type === "lesson" && a.completed === false
    );

    const shouldGetChapters = achievements.some(
      (a) => a.type === "chapter" && a.completed === false
    );

    const { totalLessons, totalChapters } =
      await this.prepareUserCompletionData(
        shouldGetLessons,
        shouldGetChapters,
        userId
      );

    return achievements.map((achievement) =>
      this.toUserAchievementDto(achievement, totalLessons, totalChapters)
    );
  }

  /**
   * Finishes a lesson for user.
   *
   * @param userId - The ID of the user.
   * @param userLesson - the user-lesson progress pair to be created.
   * @throws Will throw if the user or lesson is not found.
   *
   * @returns the created domain model User-Lesson progress entity.
   */
  async finishLessonForUser(
    userId: number,
    userLesson: UserLessonUpsertDto
  ): Promise<IUserLesson> {
    await this.validateUserAndLessonExistence(userId, userLesson.lesson_id);

    const userLessonModel: IUserLesson = {
      id: undefined,
      lesson_id: userLesson.lesson_id,
      user_id: userId,
      Started_At: userLesson.started_at,
      Completed_At: userLesson.completed_at,
    };

    const {
      inserted: insertedUserLessonProgress,
      chapter_Id,
      lessonCount,
    } = await this.lessonRepository.createUserLessonProgress(userLessonModel);

    console.log(
      `User ${userId} has now completed ${lessonCount} lessons under chapter ${chapter_Id}.`
    );

    await this.evaluateCourseCompletion(userId, chapter_Id, lessonCount);

    return insertedUserLessonProgress;
  }

  /**
   * Retrieves all users from the database.
   *
   * @returns a collection of domain model User entities.
   */
  async getAllUsers(): Promise<IUser[]> {
    return await this.userRepository.getAll();
  }

  /**
   * Retrieves a single user by their ID.
   *
   * @param id - The ID of the user.
   * @throws Will throw if the user is not found.
   *
   * @returns a single domain model User entity.
   */
  async getUserById(id: number): Promise<IUser> {
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found.`);
    }
    return user;
  }

  /**
   * Creates a new user.
   *
   * @param user - The user to be created.
   *
   * @returns the created domain model User entity.
   */
  async createUser(user: UserUpsertDto): Promise<IUser> {
    const userModel: IUser = {
      id: 0,
      username: user.username,
    };
    return await this.userRepository.create(userModel);
  }

  /**
   * Updates an existing user.
   *
   * @param id - The ID of the user to update.
   * @param user - The new user data.
   * @throws Will throw if the user does not exist.
   *
   * @returns the updated domain model User entity.
   */
  async updateUser(id: number, user: UserUpsertDto): Promise<IUser> {
    const userModel: IUser = {
      id: 0,
      username: user.username,
    };
    const updated = await this.userRepository.update(id, userModel);
    if (!updated) {
      throw new NotFoundError(
        `Failed to update user with ID ${id} because it does not exist.`
      );
    }
    return updated;
  }

  /**
   * Deletes a user by their ID.
   *
   * @param id - The ID of the user to delete.
   * @returns Whether the user was successfully deleted.
   * @throws Will throw if the user does not exist.
   */
  async deleteUser(id: number): Promise<void> {
    const success = await this.userRepository.delete(id);
    if (!success) {
      throw new NotFoundError(
        `User with ID ${id} could not be deleted because it does not exist.`
      );
    }
  }

  /**
   * Validates that the user and lesson data exists.
   *
   * @param userId - ID of the user.
   * @param lessonId - ID of the lesson.
   * @throws NotFoundError if either the user or lesson does not exist.
   */
  private async validateUserAndLessonExistence(
    userId: number,
    lessonId: number
  ): Promise<void> {
    const user = await this.userRepository.getById(userId);
    if (!user) {
      throw new NotFoundError(`User with ID ${userId} not found.`);
    }
    const lesson = await this.lessonRepository.getById(lessonId);
    if (!lesson) {
      throw new NotFoundError(`Lesson with ID ${lessonId} not found.`);
    }
  }

  /**
   * Evaluates whether a chapter or course should be marked as completed for a user,
   * based on chapter and lesson progress.
   *
   * @param user_id - The ID of the user.
   * @param chapter_id - The ID of the completed chapter.
   * @param lessonCount - The number of lessons completed under this chapter.
   */
  private async evaluateCourseCompletion(
    user_id: number,
    chapter_id: number,
    lessonCount: number
  ): Promise<void> {
    const totalLessonsCount = this.cache.getLessonCountForChapter(chapter_id);

    if (totalLessonsCount != lessonCount) return;

    const userChapterModel: IUserChapter = {
      chapter_id: chapter_id,
      user_id: user_id,
    };

    const { course_id, chapterCount } =
      await this.lessonRepository.createUserChapterProgress(userChapterModel);

    const totalChaptersCount = this.cache.getChapterCountForCourse(course_id);

    console.log(
      `User ${user_id} has now completed ${chapterCount} chapters under course ${course_id}.`
    );

    if (totalChaptersCount != chapterCount) return;

    const userCourseModel: IUserCourse = {
      course_id: course_id,
      user_id: user_id,
    };

    await this.lessonRepository.createUserCourseProgress(userCourseModel);

    console.log(`User ${user_id} has now completed course ${course_id}.`);
  }

  /**
   * Prepares the number of completed lessons and chapters for user if requested.
   *
   * @param shouldGetLessons - if we should fetch completed lessons count.
   * @param shouldGetChapters - if we should fetch completed chapters count.
   * @param userId - userId to fetch data for.
   * @returns 0 if data not needed, otherwise number of completed resources.
   */
  private async prepareUserCompletionData(
    shouldGetLessons: boolean,
    shouldGetChapters: boolean,
    userId: number
  ): Promise<{ totalLessons: number; totalChapters: number }> {
    const totalLessons = shouldGetLessons
      ? await this.lessonRepository.getCompletedLessonsForUser(userId)
      : 0;

    const totalChapters = shouldGetChapters
      ? await this.lessonRepository.getCompletedChaptersForUser(userId)
      : 0;
    return { totalLessons, totalChapters };
  }

  /**
   * Transforms IUserAchievement domain model to UserAchievementDto.
   *
   * @param achievement - Domain model representing a user’s progress toward an achievement.
   * @param totalLessons - Total lessons user has completed.
   * @param totalChapters - Total chapters user has completed.
   * @returns DTO model suitable for HTTP response.
   */
  private toUserAchievementDto(
    achievement: IUserAchievement,
    totalLessons: number,
    totalChapters: number
  ): UserAchievementDto {
    let progress: number;

    if (achievement.completed) {
      progress = achievement.threshold;
    } else if (achievement.type === "lesson") {
      progress = totalLessons;
    } else if (achievement.type === "chapter") {
      progress = totalChapters;
    } else {
      progress = 0;
    }

    return {
      achievement_id: achievement.achievement_id,
      name: achievement.name,
      earned_at: achievement.earned_at,
      completed: achievement.completed,
      progress,
    };
  }
}
