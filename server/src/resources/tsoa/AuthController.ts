import AuthService from "../../auth/AuthService";
import { Body, Post, Route, Controller, Request, Get, Security } from "tsoa";
import { JWTPayload, UserLoginRequest } from "../../types/authTypes";
import { generateJWT } from "../../utils/jwtUtils";
import { getCookieOptionsAsString } from "../../auth/cookieConfig";

/**
 * Controller for the authentication
 * Provides routes for login, logout, forgot password and change password
 */
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

    /*
     * Only set the x-auth-token header in development because swagger-ui does not support cookies
     */
    if (process.env.IS_PRODUCTION !== "true") {
      this.setHeader("x-auth-token", token);
    }

    return payload;
  }

  @Get("me")
  @Security("jwt")
  public async getUserData(@Request() request: any): Promise<JWTPayload> {
    const payload = await this.authService.getUserData(request.user.name);
    return payload;
  }

  @Post("logout")
  @Security("jwt")
  public logout(): void {
    const cookieOptions = getCookieOptionsAsString();
    this.setHeader("Set-Cookie", `token=${null}; ${cookieOptions}`);
  }
}
