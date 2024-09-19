import { JWTPayload } from "types/authTypes";

/**
 * Global context class that holds context information like the user that is currently logged in.
 */
export class Context {
  private static user: JWTPayload = null;

  public static getUser() {
    return this.user;
  }

  public static setUser(user: JWTPayload) {
    this.user = user;
  }
}
