import { dbContext } from "../db/dbContext";
import { Achievement, User_Achievement } from "../db/schemaTables";
import { IAchievement } from "../models/IAchievement";
import { IUserAchievement } from "../models/IUserAchievement";
import { IAchievementRepository } from "./IAchievementRepository";
import { InternalServerError } from "../errors/ApiErrors";
import { AchievementRow, NewUserAchievementRow } from "../db/dbTypes";
import { eq, and } from "drizzle-orm";

export class DrizzleAchievementRepository implements IAchievementRepository {

  async createUserAchievement(userId: number, achievementId: number): Promise<void> {
    const newUserAchievement: NewUserAchievementRow = {
      Achievement_ID: achievementId,
      User_ID: userId,
      Earned_At: new Date()
    };
    try {
        await dbContext
        .insert(User_Achievement)
        .values(newUserAchievement);
        console.log(`User ${userId} unlocked achievement ${achievementId} !`);
    } catch (error) {
      console.error("Error:", error);
      throw new InternalServerError(`Failed writing data to database. Info: ${error}`);
    }
  }

  async getAllAchievements(): Promise<IAchievement[] | null> {
    try {
      const rows = await dbContext.select().from(Achievement);
      return rows.map(this.toAchievementDomain);
    } catch (error) {
      console.error("Error:", error);
      throw new InternalServerError(
        `Failed reading achievements from database. Info: ${error}`
      );
    }
  }

  async getAllUserAchievementProgress(userId: number): Promise<IUserAchievement[] | null> {
    try {
        const rows = await dbContext
        .select({
          achievementId: Achievement.ID,
          name: Achievement.Name,
          type: Achievement.Type,
          threshold: Achievement.Threshold,
          courseId: Achievement.Course_ID,
          earnedAt: User_Achievement.Earned_At,
          userId: User_Achievement.User_ID,
        })
        .from(Achievement)
        .leftJoin(
          User_Achievement,
          and(
            eq(User_Achievement.Achievement_ID, Achievement.ID),
            eq(User_Achievement.User_ID, userId)
          )
        );

        return rows.map(this.toUserAchievementDomain);
    } catch (error) {
      console.error("Error:", error);
      throw new InternalServerError(
        `Failed reading user achievements from database. Info: ${error}`
      );
    }
  }

  /**
   * Transforms Database Achievement data model to domain model.
   *
   * @param row - Model of Achievement row data from database.
   * @returns IAchievement domain model of Achievement data.
   */
  private toAchievementDomain(row: AchievementRow): IAchievement {
    return {
      ID: row.ID,
      Name: row.Name,
      Type: row.Type,
      Threshold: row.Threshold,
      Course_ID: row.Course_ID ?? null,
    };
  }

  /**
   * Transforms Database User-Achievement data model to domain model.
   *
   * @param row - Model of User-Achievement row data from database.
   * @returns IUserAchievement domain model of User-Achievement data.
   */
  private toUserAchievementDomain(row: UserAchievementWithDetails): IUserAchievement {
    return {
        achievement_id: row.achievementId,
        earned_at: row.earnedAt,
        name: row.name,
        course_id: row.courseId,
        type: row.type,
        threshold: row.threshold,
        completed: row.userId !== null
    };
  }
}

/**
 * Type to model row data, only used with a query done inside of this repository.
 */
type UserAchievementWithDetails = {
    achievementId: number;
    name: string;
    type: string;
    threshold: number;
    courseId: number | null;
    earnedAt: Date | null;
    userId: number | null;
  };