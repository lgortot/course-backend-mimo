import { IUser } from "../models/IUser";

/**
 * Represents the repository for User model database operations.
 * 
 * Works with IUser domain model abstraction to avoid being tightly-coupled to concrete implementation (e.g Drizzle ORM and Sqlite)
 */
 export interface IUserRepository {
    /**
     * Retrieves all users.
     */
    getAll(): Promise<IUser[]>;
  
    /**
     * Retrieves a single user by ID.
     * 
     * @param id - The ID of the user to retrieve.
     */
    getById(id: number): Promise<IUser | null>;
  
    /**
     * Creates a new user.
     * 
     * @param user - The user entity of the new user.
     */
    create(user: IUser): Promise<IUser>;
  
    /**
     * Updates an existing user.
     * 
     * @param id - The ID of the user to update.
     * @param user - The new user entity.
     */
    update(id: number, user: IUser): Promise<IUser | null>;
  
    /**
     * Deletes a user by ID.
     * 
     * @param id - The ID of the user to delete.
     */
    delete(id: number): Promise<boolean>;
  }