import { dbContext } from "../db/dbContext";
import { User } from "../db/schemaTables";
import { eq } from "drizzle-orm";
import { IUser } from "../models/IUser";
import { NewUserRow, UserRow } from "../db/dbTypes";
import { IUserRepository } from "./IUserRepository";

export class DrizzleUserRepository implements IUserRepository {
  async getAll(): Promise<IUser[]> {
    const rows = await dbContext.select().from(User);
    return rows.map(this.toDomain);
  }

  async getById(id: number): Promise<IUser | null> {
    const rows = await dbContext.select().from(User).where(eq(User.ID, id));
    return rows[0] ? this.toDomain(rows[0]) : null;
  }

  async create(user: IUser): Promise<IUser> {
    const newUser: NewUserRow = {
      Username: user.username,
    };

    const [inserted] = await dbContext.insert(User).values(newUser).returning();

    return this.toDomain(inserted);
  }

  async update(id: number, user: IUser): Promise<IUser | null> {
    const updatedUser: Partial<NewUserRow> = {
      Username: user.username,
    };

    const [updated] = await dbContext
      .update(User)
      .set(updatedUser)
      .where(eq(User.ID, id))
      .returning();

    return updated ? this.toDomain(updated) : null;
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await dbContext.delete(User).where(eq(User.ID, id));
    return deleted.changes > 0;
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
