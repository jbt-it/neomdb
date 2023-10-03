import { NextFunction, Request, Response } from "express";
import {
  ExpiredTokenError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
  UnprocessableEntityError,
} from "../types/Errors";
import { RouteFunction } from "types/expressTypes";
import { ValidateError } from "tsoa";

/**
 * Implements the error handler middleware which handles all errors thrown by the application.
 * @deprecated Use the errorHandler from tsoa instead
 * @param err The error which was thrown
 * @param req The request which caused the error
 * @param res The response which will be send to the client
 */
const errorHandlerLegacy = (err: Error, req: Request, res: Response, next: NextFunction) => {
  switch (err.name) {
    case UnauthenticatedError.name:
      res.status(401).send(err.message);
      break;
    case UnauthorizedError.name:
      res.status(403).send(err.message);
      break;
    case NotFoundError.name:
      res.status(404).send(err.message);
      break;
    case UnprocessableEntityError.name:
    case ExpiredTokenError.name:
      res.status(422).send(err.message);
      break;
    default:
      res.status(500).send(err.message);
      break;
  }
};

/**
 * Catches all errors thrown by async function in the express application
 * and passes them to the error handler middleware
 * @param routeFunction The function which should be wrapped and contains async code
 */
export const catchAsync = (routeFunction: RouteFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    routeFunction(req, res).catch((error: Error) => {
      next(error);
    });
  };
};

/**
 * Implements the route unavailable handler middleware which handles all requests which are not handled by the application.
 * @param req The request which caused the error
 * @param res The response which will be send to the client
 */
export const routeUnavailableHandler = (req: Request, res: Response) => {
  res.status(404).json({
    message: "Route not found",
  });
};

/**
 * Implements the error handler middleware which handles all errors thrown by the application.
 * @param err The error which was thrown
 * @param req The request which caused the error
 * @param res The response which will be send to the client
 */
export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction): Response | void => {
  // -------- 404 Errors -------- \\
  if (err instanceof NotFoundError) {
    console.error(err);
    return res.status(404).json({
      message: err.message,
    });
  }
  // -------- 401 Errors -------- \\
  if (err instanceof UnauthenticatedError) {
    console.error(err);
    return res.status(401).json({
      message: err.message,
    });
  }
  // -------- 403 Errors -------- \\
  if (err instanceof UnauthorizedError) {
    console.error(err);
    return res.status(403).json({
      message: err.message,
    });
  }
  // -------- 422 Errors -------- \\
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }
  if (err instanceof ExpiredTokenError || err instanceof UnprocessableEntityError) {
    console.error(err);
    return res.status(422).json({
      message: err.message,
    });
  }
  // -------- 500 Errors -------- \\
  if (err instanceof Error) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }

  next();
};

export default errorHandlerLegacy;
