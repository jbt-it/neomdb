import { useCallback, useState } from "react";
import api from "../utils/api";
import { authReducerActionType } from "../types/globalTypes";
import { useAuth } from "../hooks/useAuth";

/**
 * This hook is responsible for checking if the user is authenticated.
 * It does this by sending a request to the backend to retrieve the user data.
 * If the request is successful, the user is authenticated.
 * If the request is not successful, the user is not authenticated.
 * @example const { checkAuth, isLoading } = useCheckAuth();
 * @returns checkAuth function and isLoading boolean
 */

export const useCheckAuth = () => {
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const { dispatchAuth } = useAuth();

  const checkAuth = useCallback(() => {
    setIsAuthLoading(true);
    api
      .get("auth/user-data")
      .then((res) => {
        // If the retrieval of the user data is succesfull the user is authenticated
        if (res.status === 200) {
          const userID = res.data.mitgliedID;
          const userName = res.data.name;
          const permissions = res.data.permissions;
          const roles = res.data.roles;
          dispatchAuth({
            type: authReducerActionType.authenticate,
            payload: { userID, userName, permissions, roles },
          });
        } else {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
        }
        setIsAuthLoading(false);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
        }
        setIsAuthLoading(false);
      });
  }, [dispatchAuth]);

  return { checkAuth, isAuthLoading };
};
