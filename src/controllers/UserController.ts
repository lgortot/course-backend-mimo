import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/UserService";
import { UserUpsertDto, UserUpsertSchema } from "../models/IUser";
import { userLessonUpsertSchema, UserLessonUpsertDto } from "../models/IUserLesson";

/**
 * Represents the controller for handling users route HTTP requests.
 */
export default class UserController {
  /**
   * Default constructor.
   *
   * @param userService - The Service responsible for handling User-related business logic.
   */
  constructor(private readonly userService: UserService) {}

  /**
   * 
   * Gets a list of all achievements for user.
   * 
   * @param req - Express model of HTTP Request.
   * @param res - Express model of HTTP Response.
   * @param next - Express NextFunction used here for delegating errors.
   */
  listAchievements = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.params.id);
      const userAchievements = await this.userService.getAchievementsForUser(userId);
      res.json(userAchievements);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 
   * Handles lesson finalization logic for user.
   * 
   * @param req - Express model of HTTP Request.
   * @param res - Express model of HTTP Response.
   * @param next - Express NextFunction used here for delegating errors.
   */
  finishLesson = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.params.id);
      const parsedUserLessonProgress = userLessonUpsertSchema.parse(req.body);
      const userLessonParsed: UserLessonUpsertDto = parsedUserLessonProgress;
      const userLessonProgress = await this.userService.finishLessonForUser(userId, userLessonParsed);
      res.json(userLessonProgress);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Gets the list of all User resources.
   *
   * @param req - Express model of HTTP Request.
   * @param res - Express model of HTTP Response.
   * @param next - Express NextFunction used here for delegating errors.
   */
  listUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Gets the User resource by id from route.
   *
   * @param req - Express model of HTTP Request.
   * @param res - Express model of HTTP Response.
   * @param next - Express NextFunction used here for delegating errors.
   */
  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const user = await this.userService.getUserById(id);
      res.json(user);
    } catch (error) {
      // could handle zod errors here and rethrow uniform API errors to clients for a cleaner api consumption doc.
      next(error);
    }
  };

  /**
   * Creates a new User resource.
   *
   * @param req - Express model of HTTP Request. Contains DTO model with User info.
   * @param res - Express model of HTTP Response.
   * @param next - Express NextFunction used here for delegating errors.
   */
  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedUser = UserUpsertSchema.parse(req.body);
      const user: UserUpsertDto = parsedUser;
      const createdUser = await this.userService.createUser(user);
      res.status(201).json(createdUser);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Updates the User resource by id from route.
   *
   * @param req - Express model of HTTP Request. Contains DTO model with User info.
   * @param res - Express model of HTTP Response.
   * @param next - Express NextFunction used here for delegating errors.
   */
  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const parsedUser = UserUpsertSchema.parse(req.body);
      const user: UserUpsertDto = parsedUser;
      const updatedUser = await this.userService.updateUser(id, user);
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Deletes the User resource by id from route.
   *
   * @param req - Express model of HTTP Request.
   * @param res - Express model of HTTP Response.
   * @param next - Express NextFunction used here for delegating errors.
   */
  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      await this.userService.deleteUser(id);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  };
}
