import { CookieOptions, NextFunction, Request, Response } from "express";

const csrf = require("csrf");
const tokens = new csrf();

/**
 * Options for the cookie for sending the csrf token
 */
const csrfTokenCookieOptions: CookieOptions = {
  maxAge: 1000 * 60 * 60, // Cookie is valid for 1h
  httpOnly: true, // Cookie is only accesible via the browser
  secure: true, // Cookie can only be sent to an HTTPS page
  sameSite: "none", // Cookie can be sent to every site
};

/**
 * Creates a new csrf token and sets a response cookie with this token
 * @param res Response object
 */
const setCsrfTokenCookie = (res: Response) => {
  const csrfToken = tokens.create(tokens.secretSync());
  res.setHeader("x-csrf-token", csrfToken);
  res.cookie("csrfToken", csrfToken, csrfTokenCookieOptions);
};

/**
 * Implements the CSRF protection middleware
 *
 * The CSRF protection uses a httpOnly cookie and a x-csrf-token header to check for the correct csrf token.
 * The middleware sends a cookie with the csrf token with the request. The request also contains a x-csrf-token header which contains the same token.
 * When a request is sent to the express server the token of the cookie and the token in the sent header are compared.
 * If they are the same we know, that the request came from a trusted source.
 */
const csrfProtectionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const csrfTokenCookie = req.cookies.csrfToken;
  const csrfTokenHeader = req.headers["x-csrf-token"];
  if (!csrfTokenCookie) {
    setCsrfTokenCookie(res);
    return res.status(403).send("No CSRF token cookie provided");
  }
  if (!csrfTokenHeader || csrfTokenHeader !== csrfTokenCookie) {
    setCsrfTokenCookie(res);
    return res.status(403).send("Invalid CSRF token");
  }
  setCsrfTokenCookie(res);

  next();
};

export default csrfProtectionMiddleware;
