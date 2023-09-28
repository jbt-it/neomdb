import AuthService from "../../auth/AuthService";
import { Body, Post, Route, Controller } from "tsoa";
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
   */
  @Post("login")
  public async login(@Body() requestBody: UserLoginRequest): Promise<JWTPayload> {
    const payload = await this.authService.loginUser(requestBody);
    const token = generateJWT(payload);

    const cookieOptions = getCookieOptionsAsString();
    this.setHeader("Set-Cookie", `token=${token}; ${cookieOptions}`);

    return payload;
  }
}
