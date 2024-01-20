/*
 * Contains custom types for the express application and its middleware functions to ensure type safety
 */
import { Request, Response } from "express";

/**
 * Definition of the type of functions which are used in the express application
 */
export type RouteFunction = (req: Request, res: Response) => Promise<Response>;
