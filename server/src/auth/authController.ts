import AuthService from "./AuthService";
import { Body, Post, Route, Controller, Request, Get, Security, Patch, Tags } from "@tsoa/runtime";
import {
  JWTPayload,
  UserChangePasswordRequest,
  UserForgotPasswordRequest,
  UserLoginRequest,
  UserResetPasswordRequest,
} from "../types/authTypes";
import { generateJWT } from "../utils/jwtUtils";
import { getCookieOptionsAsString } from "./cookieConfig";
import { UnauthorizedError } from "../types/Errors";
import * as nodemailer from "nodemailer";

/**
 * Controller for the authentication
 * Provides routes for login, logout, forgot password and change password
 */
@Tags("Auth")
@Route("auth")
export class AuthController extends Controller {
  private authService: AuthService = new AuthService();

  /**
   * Sends an httpOnly cookie to the client and retrieves id, username and corresponding permissions
   * @summary Logs in a user
   *
   * @example requestBody {
   *  "username": "w.luft",
   *  "password": "s3cre7"
   * }
   */
  @Post("login")
  public async login(@Body() requestBody: UserLoginRequest): Promise<JWTPayload> {
    const payload = await this.authService.loginUser(requestBody);
    const token = generateJWT(payload);

    const cookieOptions = getCookieOptionsAsString();
    this.setHeader("Set-Cookie", `token=${token}; ${cookieOptions}`);

    return payload;
  }

  /**
   * Sends the user data of the currently logged in user to the client
   * @summary Retrieves own user data
   */
  @Get("me")
  @Security("jwt")
  public async getUserData(@Request() request: any): Promise<JWTPayload> {
    const user = request.user as JWTPayload;
    const payload = await this.authService.getUserData(user.name);
    const token = generateJWT(payload);

    const cookieOptions = getCookieOptionsAsString();
    this.setHeader("Set-Cookie", `token=${token}; ${cookieOptions}`);

    return payload;
  }

  /**
   * Updates the passwordHash in the database if the old password is correct
   * @summary Changes the users password
   *
   * @example requestBody {
   * "userName": "w.luft",
   * "oldPassword": "s3cre7",
   * "newPassword": "s3cre7",
   * "userID": 8167
   * }
   */
  // TODO: Use @Post("change-password") instead of @Patch("change-password")
  @Patch("change-password")
  @Security("jwt")
  public async changePassword(@Body() requestBody: UserChangePasswordRequest, @Request() request: any): Promise<void> {
    const user = request.user;
    if (user.name !== requestBody.userName) {
      throw new UnauthorizedError("You are not allowed to change the password of another user");
    }

    await this.authService.changeUserPassword(requestBody);
  }

  /**
   * An email is sent with an password reset link and a key in the url to the user
   * The key used in the link is saved in the databse for the later verification
   * @summary Sends a password reset link to the user
   *
   * @example requestBody {
   * "email": "w.luft@studentische-beratung.de"
   * }
   */
  @Post("forgot-password")
  public async sendPasswordResetLink(@Body() requestBody: UserForgotPasswordRequest): Promise<void> {
    const email = requestBody.email;
    const name = String(email).split("@")[0];
    const token = await this.authService.createPasswordResetToken(name, email);

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
      tls: {
        rejectUnauthorized: false,
      },
    });
    // Setup e-mail data with unicode symbols
    const mailOptions = {
      from: '"JBT MDB SUPPORT" <mdb@studentische-beratung.de>', // TODO actual sender address
      to: requestBody.email, // List of receivers
      subject: "Passwort zurücksetzen", // Subject line
      text:
        "Hello " +
        name +
        ",\n\n" +
        "Es gab eine Anfrage, dein Passwort für die MDB zu ändern! \n" +
        "Falls du diese Anfrage nicht gestellt haben, ignoriere bitte diese E-Mail oder wende dich an das Ressort IT. \n" +
        "Andernfalls verwende bitte die folgende URL, um dein Passwort zu ändern: \n\n" +
        "http://localhost:3000/#/passwort-vergessen-zuruecksetzten/" + // TODO use actual website instead of localhost
        token +
        "\n\n" +
        "\n\n" +
        "Beste Grüße \n\n" +
        "Dein Ressort IT",
    };
    // TODO: Handle Errors
    transport.sendMail(mailOptions);
  }

  /**
   * The user can set a new password by entering their mailadress and a new password
   * The mail and the key in the url are then checked to se if it is a valid pair
   * If the pair is valid the new password is stored
   * @summary Resets the password of a user
   *
   * @example requestBody {
   * "email": "w.luft@studentische-beratung.de",
   * "key": "1234567890",
   * "newPassword": "s3cre7"
   * }
   */
  // TODO: Use @Post("reset-forgot-password") instead of @Patch("reset-forgot-password")
  @Patch("reset-forgot-password")
  public async resetPasswordWithKey(@Body() requestBody: UserResetPasswordRequest): Promise<void> {
    const { email, key, newPassword } = requestBody;
    const name = String(email).split("@")[0];

    await this.authService.resetPasswordWithToken(name, email, key, newPassword);
  }

  /**
   * Logs the user out by removing the jwt from the cookie
   * @summary Logs out the user
   *
   */
  @Post("logout")
  @Security("jwt")
  public logout(): void {
    const cookieOptions = getCookieOptionsAsString();
    this.setHeader("Set-Cookie", `token=${null}; ${cookieOptions}`);
  }
}
