import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/UserService";
import { IUser } from "../models/IUser";

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
   * Gets the list of all User resources.
   * 
   * @param req - Express model of HTTP Request.
   * @param res - Express model of HTTP Response.
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
   */
  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const user = await this.userService.getUserById(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Creates a new User resource.
   * 
   * @param req - Express model of HTTP Request. Contains DTO model with User info.
   * @param res - Express model of HTTP Response.
   */
  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: IUser = req.body;
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
   */
  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const user: IUser = req.body;
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
