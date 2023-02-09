import { NextFunction, Request, Response } from "express";

/**
 * Implements the referer validation
 *
 * Referer validation is important to check if a request was sent from a trusted source
 */
const refererValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const referer = req.headers.referer;
  if (!referer === null || referer === undefined) {
    return res.status(400).send("Referer header is missing");
  }
  if (!referer.startsWith(process.env.ORIGIN)) {
    return res.status(400).send("Referer header is invalid");
  }
  next();
};

export default refererValidationMiddleware;
