import * as request from "supertest";
import { Express } from "express";
import AuthRepository from "auth/AuthRepository";
import { createCurrentTimestamp } from "utils/dateUtils";

/**
 * Utility class for testing the auth routes
 */
class AuthTestUtils {
  authRepository = null;
  app = null;

  constructor(app: Express) {
    this.app = app;
    this.authRepository = new AuthRepository();
  }

  /**
   * Performs a login request and returns the response
   * @param username The username
   * @param password The password
   * @returns The response
   */
  performLogin = async (username: string, password: string) => {
    const response = await request(this.app).post("/api/auth/login").send({ username: username, password: password });

    return response;
  };

  /**
   * Extracts the authentication token from the response
   * @param response The response
   * @returns The authentication token
   */
  extractAuthenticatonToken = (response: request.Response) => {
    const cookies = response.headers["set-cookie"];
    try {
      const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
      const token = tokenCookie.split(";")[0].split("=")[1];

      return token;
    } catch (error) {
      throw new Error("No token found in response");
    }
  };

  /**
   * Retrieves the password reset token from the database
   * @param email The email of the user of the password reset entry
   */
  retrievePasswordResetTokenFromDB = async (email: string) => {
    const date = createCurrentTimestamp();
    this.authRepository.getPasswordReserEntryByEmailAndToken(date, email, "token");
  };
}

export default AuthTestUtils;
