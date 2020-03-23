/*
 * The AuthContext provides a state, which indicates whether the user is authenticated or not
 */
import React, {useState, createContext} from "react";

/**
 * Represents the context for Authentication
 *
 */
export const AuthContext = createContext<[boolean, Function]>([false, ()=>null]);

/**
 * Provider of the Authentication
 *
 * @param props
 */
export const AuthProvider = (props: {children?:any}) => {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <AuthContext.Provider value={[authenticated, setAuthenticated]}>
      {props.children}
    </AuthContext.Provider>
  );
};