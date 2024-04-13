// The AuthContext provides a state, which indicates whether the user is authenticated or not

import React, { createContext, useReducer } from "react";
import { Auth, AuthContextType, authReducerAction, authReducerActionType } from "../../types/globalTypes";

/**
 * The initial state of the auth object
 */
const initialState = {
  authenticated: false,
  userID: null,
  userName: null,
  permissions: [],
  roles: [],
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
        roles: action.payload.roles,
      };
    }
    case authReducerActionType.deauthenticate: {
      return {
        authenticated: false,
        userID: null,
        userName: null,
        permissions: [],
        roles: [],
      };
    }
    default: {
      return state;
    }
  }
};
/*
 * Provider of the Authentication
 *
 * @param props
 */
export const AuthProvider = (props: { children?: React.ReactNode }) => {
  const [auth, dispatchAuth] = useReducer(authReducer, {
    authenticated: false,
    userID: null,
    userName: null,
    permissions: [],
    roles: [],
  });

  return <AuthContext.Provider value={{ auth, dispatchAuth }}>{props.children}</AuthContext.Provider>;
};
