import { Router } from "express";
import { DrizzleUserRepository } from "../repositories/DrizzleUserRepository";
import { UserService } from "../services/UserService";
import UserController from "../controllers/UserController";
import { DrizzleLessonRepository } from "../repositories/DrizzleLessonRepository";

/**
 * Creates the router for User resource routes with the UserController to handle HTTP requests.
 * @returns - the express router instance.
 */
export default function createUsersRouter(): Router {
    const userRepo = new DrizzleUserRepository();
    const lessonRepo = new DrizzleLessonRepository();
    const service = new UserService(userRepo, lessonRepo);
    const controller = new UserController(service);
    const router = Router();
    
    // relative routes for separation of concerns. Can be reused across versioning and different sub-routes.
    router.get('/', controller.listUsers);
    router.get('/:id', controller.getUserById);
    router.post('/', controller.createUser);
    router.put('/:id', controller.updateUser);
    router.delete('/:id', controller.deleteUser);
    router.post('/:id/finishLesson', controller.finishLesson);

    return router;
}