// The AuthContext provides a state, which indicates whether the user is authenticated or not

import React, { createContext, useReducer } from "react";
import { Auth, AuthContextType, authReducerAction, authReducerActionType, Permission } from "../global/globalTypes";

/**
 * The initial state of the auth object
 */
const initialState = {
  authenticated: false,
  userID: null,
  userName: null,
  permissions: [],
};
/*
 * Represents the context for Authentication
 *
 * Initialized with false (represents authenticated) and a dummy function which returns null (represents setAuthenticated)
 */
export const AuthContext = createContext<AuthContextType>({
  auth: initialState,
  dispatchAuth: () => null,
});

/*
 * Provider of the Authentication
 *
 * @param props
 */
export const AuthProvider = (props: { children?: any }) => {
  /**
   * The reducer function for the auth object
   * It manages how the auth object can be changed
   * @param state The current state of the auth object
   * @param action The action that should be performed
   * @returns The new state of the auth object
   */
  const authReducer = (state: Auth, action: authReducerAction) => {
    switch (action.type) {
      case authReducerActionType.authenticate: {
        return {
          authenticated: true,
          userID: action.payload.userID,
          userName: action.payload.userName,
          permissions: action.payload.permissions,
        };
      }
      case authReducerActionType.deauthenticate: {
        return {
          authenticated: false,
          userID: null,
          userName: null,
          permissions: [],
        };
      }
      default: {
        return state;
      }
    }
  };

  const [auth, dispatchAuth] = useReducer(authReducer, {
    authenticated: false,
    userID: null,
    userName: null,
    permissions: [],
  });

  return <AuthContext.Provider value={{ auth, dispatchAuth }}>{props.children}</AuthContext.Provider>;
};

/**
 * Checks if a given id is in the given permissions list
 * @param permissions The list of the permissions of the current user
 * @param id The id that the user should have
 * @returns true if the permissions list of the current user contains the given id
 */
export const checkForPermissions = (permissions: Permission[], id: number) => {
  return permissions.filter((perm) => perm.permissionID === id).length > 0;
};
