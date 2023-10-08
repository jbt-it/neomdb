import { useContext } from "react";
import { AuthContext } from "../context/auth-context/AuthContext";

export const useAuth = () => {
  return useContext(AuthContext);
};
