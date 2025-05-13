import { NotFoundError } from "../errors/ApiErrors";
import { IUser } from "../models/IUser";
import { IUserRepository } from "../repositories/IUserRepository";

/**
 * Service layer for handling business logic related to User resource operations.
 * 
 */
export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

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
  async createUser(user: IUser): Promise<IUser> {
    return await this.userRepository.create(user);
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
  async updateUser(id: number, user: IUser): Promise<IUser> {
    const updated = await this.userRepository.update(id, user);
    if (!updated) {
      throw new NotFoundError(`Failed to update user with ID ${id} because it does not exist.`);
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
      throw new NotFoundError(`User with ID ${id} could not be deleted because it does not exist.`);
    }
  }
}
