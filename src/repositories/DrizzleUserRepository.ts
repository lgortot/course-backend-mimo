import { dbContext } from "../db/dbContext";
import { User } from "../db/schemaTables";
import { eq } from "drizzle-orm";
import { IUser } from "../models/IUser";
import { NewUserRow, UserRow } from "../db/dbTypes";
import { IUserRepository } from "./IUserRepository";
import { InternalServerError } from "../errors/ApiErrors";

/**
 * Drizzle ORM + SQLite implementation of the User resource Repository.
 */
export class DrizzleUserRepository implements IUserRepository {
  async getAll(): Promise<IUser[]> {
    try {
      const rows = await dbContext.select().from(User);
      return rows.map(this.toDomain);
    } catch (error) {
      console.error("Error:", error);
      throw new InternalServerError(`Failed reading data from database. Info: ${error}`);
    }
  }

  async getById(id: number): Promise<IUser | null> {
    try {
      const rows = await dbContext.select().from(User).where(eq(User.ID, id));
      return rows[0] ? this.toDomain(rows[0]) : null;
    } catch (error) {
      console.error("Error:", error);
      throw new InternalServerError(`Failed reading data from database. Info: ${error}`);
    }
  }

  async create(user: IUser): Promise<IUser> {
    const newUser: NewUserRow = {
      Username: user.username,
    };

    try {
      const [inserted] = await dbContext
        .insert(User)
        .values(newUser)
        .returning();
      return this.toDomain(inserted);
    } catch (error) {
      console.error("Error:", error);
      throw new InternalServerError(`Failed writing data to database. Info: ${error}`);
    }
  }

  async update(id: number, user: IUser): Promise<IUser | null> {
    const updatedUser: Partial<NewUserRow> = {
      Username: user.username,
    };

    try {
      const [updated] = await dbContext
        .update(User)
        .set(updatedUser)
        .where(eq(User.ID, id))
        .returning();
      return updated ? this.toDomain(updated) : null;
    } catch (error) {
      console.error("Error:", error);
      throw new InternalServerError(`Failed updating data in database. Info: ${error}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const deleted = await dbContext.delete(User).where(eq(User.ID, id));
      return deleted.changes > 0;
    } catch (error) {
      console.error("Error:", error);
      throw new InternalServerError(`Failed deleting data from database. Info: ${error}`);
    }
  }

  /**
   * Transforms Database User model to domain model.
   *
   * @param row - Model of User row data from database.
   * @returns IUser domain model of User row data from database.
   */
  private toDomain(row: UserRow): IUser {
    return {
      id: row.ID,
      username: row.Username ?? "",
    };
  }
}
