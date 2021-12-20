/**
 * The type for the auth context
 */
export type AuthContextType = {
  auth: Auth;
  dispatchAuth: Function;
};

/**
 * The type for the authentication object with user information
 */
export type Auth = {
  authenticated: boolean;
  userID: number | null;
  userName: string | null;
  permissions: number[];
};

/**
 * Enum for the differents types of actions for the auth reducer function
 */
export enum authReducerActionType {
  /*
   */
  authenticate = "AUTHENTICATE",

  /*
   */
  deauthenticate = "DEAUTHENTICATE",
}

/**
 * Type of the different actions for the authentication
 */
export type authReducerAction =
  | {
      type: authReducerActionType.authenticate;
      payload: {
        userID: number;
        userName: string;
        permissions: number[];
      };
    }
  | {
      type: authReducerActionType.deauthenticate;
    };
