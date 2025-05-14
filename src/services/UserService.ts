import { ILessonRepository } from "../repositories/ILessonRepository";
import { NotFoundError } from "../errors/ApiErrors";
import { IUser, UserUpsertDto } from "../models/IUser";
import { IUserRepository } from "../repositories/IUserRepository";
import { IUserLesson, UserLessonUpsertDto } from "../models/IUserLesson";

/**
 * Service layer for handling business logic related to User resource operations.
 *
 */
export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly lessonRepository: ILessonRepository
  ) {}

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
    const user = await this.userRepository.getById(userId);
    if (!user) {
      throw new NotFoundError(`User with ID ${userId} not found.`);
    }
    const lesson = await this.lessonRepository.getById(userLesson.lesson_id);
    if (!lesson) {
      throw new NotFoundError(
        `Lesson with ID ${userLesson.lesson_id} not found.`
      );
    }
    const userLessonModel: IUserLesson = {
      id: undefined,
      lesson_id: userLesson.lesson_id,
      user_id: userId,
      Started_At: userLesson.started_at,
      Completed_At: userLesson.completed_at,
    };

    const { inserted, chapter_Id, lessonCount } =
      await this.lessonRepository.createUserLessonProgress(userLessonModel);

    console.log(`User ${userId} has now completed ${lessonCount} lessons under chapter ${chapter_Id}.`);

    return inserted;
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
}
