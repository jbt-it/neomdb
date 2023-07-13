/**
 * Definition of the functions required for authentification and authorization
 */
import { CookieOptions, Request, Response } from "express";
import * as authTypes from "../types/authTypes";
import { generateJWT, verifyJWT } from "../utils/jwtUtils";
import AuthService from "./authService";

/**
 * Options for the cookie
 */
const cookieOptions: CookieOptions = {
  httpOnly: true, // Cookie is only accesible via the browser
  secure: true, // Cookie can only be sent to an HTTPS page
  sameSite: "none", // Cookie can be sent to every site
};

const authService = new AuthService();

/**
 * Sends an httpOnly cookie to the client and retrieves id, username and corresponding permissions
 */
export const login = async (req: Request, res: Response): Promise<Response> => {
  const userLoginRequest = req.body as authTypes.UserLoginRequest;
  const payload = await authService.loginUser(userLoginRequest);
  const token = generateJWT(payload);
  return res.cookie("token", token, cookieOptions).status(200).json(payload);
};

/**
 * Retrieves the data of the currently logged in user
 */
export const retrieveUserData = async (req: Request, res: Response): Promise<Response> => {
  const jwtData = verifyJWT(req.cookies.token);
  const payload = await authService.getUserData(jwtData.name);
  return res.status(200).json(payload);
};

/**
 * Updates the passwordHash in the database if the old password is correct
 */
export const changePassword = async (req: Request, res: Response): Promise<Response> => {
  const userChangePasswordRequest = req.body as authTypes.UserChangePasswordRequest;
  await authService.changeUserPassword(userChangePasswordRequest);
  return res.status(200).send("The new password has been saved");
};

/**
 * Loggs the user out by removing the jwt from the cookie
 */
export const logout = (req: Request, res: Response): Response => {
  const token = null;
  return res.cookie("token", token, cookieOptions).status(200).send("Logout succesful!");
};
