/**
 * Definition of the functions required for authentification and authorization
 */
import { CookieOptions, Request, Response } from "express";
import * as authTypes from "../types/authTypes";
import { generateJWT, verifyJWT } from "../utils/jwtUtils";
import AuthService from "./AuthService";
import nodemailer = require("nodemailer");

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

/**
 * An email is sent with an password reset link and a key in the url to the user
 * The key used in the link is saved in the databse for the later verification
 */
export const sendPasswordResetLink = async (req: Request, res: Response): Promise<Response> => {
  const email = req.body.email;
  const name = String(email).split("@")[0];
  const hash = await authService.createPasswordResetToken(name, email);

  /**
   * // TODO: implement nodemailer to be able to send mails with microsoft exchange 365
   * put nodemailer transporter in a new file
   */
  // Send email with correct URL to usermail
  const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER, // Email
      pass: process.env.MAIL_PASSWORD, // PW
    },
  }); // Setup e-mail data with unicode symbols
  const mailOptions = {
    from: '"JBT MDB SUPPORT" <foo@studentische-beratung.de>', // TODO actual sender address
    to: req.body.email, // List of receivers
    subject: "Passwort reset link for the account belonging to this mail", // Subject line
    text:
      "Hello " +
      name +
      ",\n\n" +
      "There was a request to change your password for the MDB! \n\n" +
      "If you did not make this request then please ignore this email. \n\n" +
      "Otherwise, please use this url to change your password: \n\n" +
      "http://localhost:3000/#/passwort-vergessen-zuruecksetzten/" + // TODO use actual website instead of localhost
      hash +
      "\n\n" +
      "Regards your IT ressort", // Plaintext body
  };

  return res.status(200).send();
};

/**
 * The user can set a new password by entering their mailadress and a new password
 * The mail and the key in the url are then checked to se if it is a valid pair
 * If the pair is valid the new password is stored
 */
export const resetPasswordWithKey = async (req: Request, res: Response): Promise<Response> => {
  const { email, token, newPassword } = req.body;
  const name = String(email).split("@")[0];

  await authService.resetPasswordWithToken(name, email, token, newPassword);

  return res.status(200).send("Password reset succesful");
};
