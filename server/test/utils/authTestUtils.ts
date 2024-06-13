import { PasswordResetRepository } from "../../src/auth/PasswordResetRepository";
import request from "supertest";

/**
 * Utility class for testing the auth routes
 */
class AuthTestUtils {
  app: Express.Application = null;

  constructor(app: Express.Application) {
    this.app = app;
  }

  /**
   * Performs a login request and returns the response
   * @param username The username
   * @param password The password
   * @returns The response
   */
  performLogin = async (username: string, password: string) => {
    const response = await request(this.app).post("/api/auth/login").send({ username, password });

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
      console.error("Error extracting token from response", error);
      throw new Error("No token found in response");
    }
  };

  /**
   * Creates a password reset entry in the database for the given email for testing purposes
   * @param email The email of the password reset entry
   * @param token The token of the password reset entry
   */
  createPasswordResetEntry = async (email: string, token: string) => {
    try {
      // Tries to delete the old entry, if any exists
      try {
        await PasswordResetRepository.deletePasswordResetEntriesByEmail(email);
      } catch (error) {
        // Do nothing
      }
      await PasswordResetRepository.createPasswordResetEntry(email, "salt", token);
    } catch (error) {
      console.error(`Error creating password reset entry "${token}" for email ${email}: ${error}`);
      throw new Error(`Error creating password reset entry "${token}" for email ${email}: ${error}`);
    }
  };
}

export default AuthTestUtils;
