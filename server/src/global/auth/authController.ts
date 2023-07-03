/**
 * Definition of the functions required for authentification and authorization
 */
import { CookieOptions, Request, Response } from "express";
import { generateJWT, verifyJWT } from "../../utils/jwtUtils";
import { getUserData, loginUser } from "./authServices";
import * as authTypes from "./authTypes";

/**
 * Options for the cookie
 */
const cookieOptions: CookieOptions = {
  httpOnly: true, // Cookie is only accesible via the browser
  secure: true, // Cookie can only be sent to an HTTPS page
  sameSite: "none", // Cookie can be sent to every site
};

/**
 * Sends an httpOnly cookie to the client and retrieves id, username and corresponding permissions
 */
export const login = async (req: Request, res: Response): Promise<Response> => {
  const payload = await loginUser(req.body as authTypes.UserLoginRequest);
  const token = generateJWT(payload);
  return res.cookie("token", token, cookieOptions).status(200).json(payload);
};

/**
 * Retrieves the data of the currently logged in user
 */
export const retrieveUserData = async (req: Request, res: Response): Promise<Response> => {
  const jwtData = verifyJWT(req.cookies.token);
  const payload = await getUserData(jwtData.name);
  return res.status(200).json(payload);
};

/**
 * Loggs the user out by removing the jwt from the cookie
 */
export const logout = (req: Request, res: Response) => {
  const token = null;
  res.cookie("token", token, cookieOptions).status(200).send("Logout succesful!");
};
