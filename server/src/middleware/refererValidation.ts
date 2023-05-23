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
  /*
   * Check if the referer header starts with the origin
   * If the referer header does not start with the origin,
   * this means that the request was sent from an untrusted source
   */
  if (!referer.startsWith(process.env.ORIGIN)) {
    return res.status(400).send("Referer header is invalid");
  }
  next();
};

export default refererValidationMiddleware;
