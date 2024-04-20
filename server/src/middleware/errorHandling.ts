import { NextFunction, Request, Response } from "express";
import {
  ConflictError,
  ExpiredTokenError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
  UnprocessableEntityError,
} from "../types/Errors";
import { ValidateError } from "tsoa";
import logger from "../logger";

/**
 * Implements the error handler middleware which handles all errors thrown by the application.
 * @param err The error which was thrown
 * @param req The request which caused the error
 * @param res The response which will be send to the client
 */
export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction): Response | void => {
  // -------- 404 Errors -------- \\
  if (err instanceof NotFoundError) {
    logger.warn(`Caught not found error for ${req.path}: ${err}`);
    return res.status(404).json({
      message: err.message,
    });
  }
  // -------- 401 Errors -------- \\
  if (err instanceof UnauthenticatedError) {
    logger.warn(`Caught unauthenticated error for ${req.path}: ${err}`);
    return res.status(401).json({
      message: err.message,
    });
  }
  // -------- 403 Errors -------- \\
  if (err instanceof UnauthorizedError) {
    logger.warn(`Caught unauthorized error for ${req.path}: ${err}`);
    return res.status(403).json({
      message: err.message,
    });
  }
  // -------- 422 Errors -------- \\
  if (err instanceof ValidateError) {
    logger.warn(`Caught Validation Error for ${req.path}: ${JSON.stringify(err?.fields)}`);
    return res.status(422).json({
      message: "Validation Failed",
    });
  }
  if (err instanceof ExpiredTokenError || err instanceof UnprocessableEntityError) {
    logger.warn(`Caught expired token or unprocessable entity error for ${req.path}: ${err}`);
    return res.status(422).json({
      message: err.message,
    });
  }
  if (err instanceof ConflictError) {
    logger.warn(`Caught conflict entity error for ${req.path}: ${err}`);
    return res.status(409).json({
      message: err.message,
    });
  }
  // -------- 500 Errors -------- \\
  if (err instanceof Error) {
    logger.error(`Caught unknown error for ${req.path}: ${err}`);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }

  next();
};

export default errorHandler;
