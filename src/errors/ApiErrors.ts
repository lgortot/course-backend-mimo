/**
 * Custom ApiError to throw in case something goes wrong.
 */
export class ApiError extends Error {
  public statusCode: number;

  constructor(message: string = "Something went wrong.", statusCode = 500) {
    super(message);
    this.statusCode = statusCode;

    // Restore prototype chain - necessary for typechecking to work with built-in classes like Error
    // .. and we extend Error here.
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

/**
 * HTTP Status 404 - related error class type.
 */
export class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

/**
 * HTTP Status 400 - related error class type.
 */
export class BadRequestError extends ApiError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}

/**
 * Http Status 500 - related error clas type.
 */
export class InternalServerError extends ApiError {
  constructor(message = "Internal server error") {
    super(message, 500);
  }
}
