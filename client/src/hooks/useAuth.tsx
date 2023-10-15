import { useContext } from "react";
import { AuthContext } from "../context/auth-context/AuthContext";

/**
 * This hook is responsible for retrieving the auth context by using the AuthContext.
 * @example const { auth, dispatchAuth } = useAuth();
 * @returns the auth context
 */
export const useAuth = () => {
  return useContext(AuthContext);
};
