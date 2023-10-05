import React, { useContext, useEffect, useCallback, useState, memo } from "react";
import { AuthContext } from "../../context/auth-context/AuthContext";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import api from "../../utils/api";
import { authReducerActionType } from "../../types/globalTypes";
import { doesPermissionsHaveSomeOf } from "../../utils/authUtils";

import LoadingCircle from "../general/LoadingCircle";

const ProtectedRoute = memo(({ component: Component, permissionIDs, ...rest }: any) => {
  const [checkAuthLoading, setCheckAuthLoading] = useState(true);
  const { auth, dispatchAuth } = useContext(AuthContext);
  const location = useLocation();

  const checkAuth = useCallback(() => {
    // Tries to retrieve the user data
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
        setCheckAuthLoading(false);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
        }
        setCheckAuthLoading(false);
      });
  }, [dispatchAuth]);
  /**
   * Checks if the currently logged in user has the permission numbers specified
   * @param permissionNumbers numbers/ids of the permissions (can be empty to indicate, that the user must have at least one permission)
   * @returns true if the user has the given permissions
   */
  const checkForPermission = (permissionNumbers: number[]) => {
    if (permissionNumbers.length === 0) {
      // Check if the given permissionNumbers array contains at least one permission id.
      return auth.permissions.length > 0;
    }
    return doesPermissionsHaveSomeOf(auth.permissions, permissionNumbers);
  };
  // Calls checkAuth on (re)render of routes
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return checkAuthLoading ? (
    <LoadingCircle />
  ) : checkForPermission(permissionIDs) ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
});

export default ProtectedRoute;
