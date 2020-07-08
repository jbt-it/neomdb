// The AuthContext provides a state, which indicates whether the user is authenticated or not

import React, {useState, createContext} from "react";

/**
 * Represents the context for Authentication
 *
 * Initialized with false (represents authenticated) and a dummy function which returns null (represents setAuthenticated)
 */
export const AuthContext = createContext<[boolean, Function, number, Function, string, Function]>([false, ()=>null, -1, ()=>null, "", ()=>null]);

/**
 * Provider of the Authentication
 *
 * @param props
 */
export const AuthProvider = (props: {children?:any}) => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [userID, setUserID] = useState<number>(-1);
  const [userName, setUserName] = useState<string>("");

  return (
    <AuthContext.Provider value={[authenticated, setAuthenticated, userID, setUserID, userName, setUserName]}>
      {props.children}
    </AuthContext.Provider>
  );
};