import express, { json, Express } from "express";
import { IDataCache } from "../cache/IDataCache";
import { InMemoryDataCache } from "../cache/InMemoryDataCache";
import { DrizzleLessonRepository } from "../repositories/DrizzleLessonRepository";
import errorHandlerMiddleware from "../middleware/errorHandlerMiddleware";
import createUsersRouter from "../routes/userRoutes";
import { sqlite } from "../db/dbContext";

/**
 * Represents the core HTTP server application.
 *
 * Encapsulates the Express app configuration, including middleware, routing,
 * and server startup logic.
 */
export default class Server {
  private app: Express;
  private port: number;

  /**
   * Creates an instance of the server application.
   *
   * @param port - The port number the server should listen on.
   */
  constructor(port: number) {
    this.port = port;
    this.app = express();
  }

  /**
   * Configures server middleware.
   */
  private setupMiddleware(): void {
    this.app.use(json());
  }

  /**
   * Configures server routes.
   */
  private setupRoutes(): void {
    this.app.use("/users", createUsersRouter());
    this.app.get("/", (req, res) => {
      res.send("Hello world!");
    });
  }

  /**
   * Configures error handler middleware.
   */
  private setupErrorHandlerMiddleware(): void {
    this.app.use(errorHandlerMiddleware);
  }

  /**
   * Initializes and returns the shared data cache.
   */
  private async setupDataCache(): Promise<IDataCache> {
    const lessonRepo = new DrizzleLessonRepository(); // good case for a DI container like InversifyJS since we use this across different places in app
    const cache = new InMemoryDataCache(lessonRepo);
    await cache.initializeCache();
    return cache;
  }

  /**
   * Initializes server dependencies and starts the server.
   */
  public async start(): Promise<void> {
    try {
      const cache = await this.setupDataCache();
      this.setupMiddleware();
      this.setupRoutes();
      this.setupErrorHandlerMiddleware();
      this.app.listen(this.port, () => {
        console.log(`Server is running on port ${this.port}`);
      });
    } catch (error) {
      console.error("Error during server startup:", error);
      sqlite.close();
      process.exit(1);
    }
  }
}
