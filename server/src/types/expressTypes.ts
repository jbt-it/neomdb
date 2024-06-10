/*
 * Contains custom types for the express application and its middleware functions to ensure type safety
 */
import { Request, Response } from "express";
import { JWTPayload } from "./authTypes";

/**
 * Definition of the type of functions which are used in the express application
 */
export type RouteFunction = (req: Request, res: Response) => Promise<Response>;

/**
 * Extended express request type which contains the user object if the user is authenticated.
 * Using index.d.ts to extend the request does not work, because tsoa does not recognize it.
 *
 * This type is used in the controller functions to check user privileges.
 */
export type ExpressRequest = Request & { user?: JWTPayload };
