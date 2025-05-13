import express, { json, Express } from 'express';

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
    this.app.get("/", (req, res) => {
      res.send("Hello world!");
    });
  }

  /**
   * Initializes server dependencies and starts the server.
   */
  public start(): void {
    this.setupMiddleware();
    this.setupRoutes();
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}