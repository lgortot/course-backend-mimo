import { IAchievement } from "../models/IAchievement";
import { IUserAchievement } from "../models/IUserAchievement";

/**
 * Represents the repository for User-Achievement model database operations.
 *
 * Works with IUserAchievement and IAchievement domain model abstractions to avoid being tightly-coupled to concrete implementation (e.g Drizzle ORM and Sqlite)
 */
export interface IAchievementRepository {
  /**
   * Retrieves a list of all User-Achievement completion models for provided user.
   *
   * @param userId - user to get achievements for.
   */
  getAllUserAchievementProgress(userId: number): Promise<IUserAchievement[] | null>;

  /**
   * Retrieves a list of all Achievement models.
   *
   */
  getAllAchievements(): Promise<IAchievement[] | null>;
}
