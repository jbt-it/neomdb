/**
 * The type for the auth context
 */
export type AuthContextType = {
  auth: Auth;
  dispatchAuth: React.Dispatch<authReducerAction>;
};

export type Permission = {
  permissionID: number;
  canDelegate: boolean;
};

/**
 * The type for the authentication object with user information
 */
export type Auth = {
  authenticated: boolean;
  userID: number | null;
  userName: string | null;
  permissions: Permission[];
  roles: number[];
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
        permissions: Permission[];
        roles: number[];
      };
    }
  | {
      type: authReducerActionType.deauthenticate;
    };

export type ChangePasswordParams = {
  oldPassword: string;
  newPassword: string;
  userID: number | null;
  userName: string | null;
};
