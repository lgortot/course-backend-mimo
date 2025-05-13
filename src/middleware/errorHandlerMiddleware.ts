import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError } from "../errors/ApiErrors";

/**
 * Error handler middleware to avoid boilerplate error handling code across controllers.
 *
 * @param err - The error that occured.
 * @param req - The Request entity tied to the HTTP Request Processing pipeline.
 * @param res - The Response entity to fire from event handler.
 * @param next - HTTP Processing pipeline next function.
 */
const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof ApiError) {
    console.warn("Error:", err);
    res.status(err.statusCode).json({ error: err.message });
    return;
  } else if (err instanceof ZodError) {
    console.warn("Error:", err);
    res
      .status(400)
      .json({ errors: err.errors, message: "Bad client request." });
  } else {
    console.error("Error:", err);
    res.status(500).json({ error: "An unexpected error occurred." });
    return;
  }
};

export default errorHandlerMiddleware;
