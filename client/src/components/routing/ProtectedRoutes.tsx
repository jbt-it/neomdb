import React, { useContext } from "react";
import { AuthContext } from "../../context/auth-context/AuthContext";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { doesPermissionsHaveSomeOf } from "../../utils/authUtils";

const ProtectedRoute = ({ children, permissionIDs }: any) => {
  const { auth } = useContext(AuthContext);
  const location = useLocation();

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
  return checkForPermission(permissionIDs) ? (
    <>{children}</>
  ) : (
    <Navigate to="/" state={{ from: location }} replace={true} />
  );
};

export default ProtectedRoute;
