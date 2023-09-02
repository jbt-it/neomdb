import { NextFunction, Request, Response } from "express";
import { NotFoundError, UnauthenticatedError, UnauthorizedError, UnprocessableEntityError } from "../types/errors";
import { RouteFunction } from "types/expressTypes";

/**
 * Implements the error handler middleware which handles all errors thrown by the application.
 * @param err The error which was thrown
 * @param req The request which caused the error
 * @param res The response which will be send to the client
 */
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
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

export default errorHandler;
