/*
 * Contains custom error types thrown by the application
 */

/**
 * Error thrown when a resource is not found
 */
export class NotFoundError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

/**
 * Error thrown when the user is not authorized to access a resources
 */
export class UnautherizedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "UnautherizedError";
  }
}

/**
 * Error thrown when the user is not authenticated
 */
export class UnauthenticatedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "UnauthenticatedError";
  }
}

/**
 * Error thrown when a query fails
 */
export class QueryError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "QueryError";
  }
}