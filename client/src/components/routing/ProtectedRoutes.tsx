import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import { doesPermissionsHaveSomeOf } from "../../utils/authUtils";

/**
 * This file contains the ProtectedRoute component, which is responsible for rendering the protected routes of the application.
 * The protected routes are the routes that require the user to have a specific permission, the component is a wrapper for the protected routes.
 * It checks if the user has the required permission by checking the permissions array of the user.
 * If the user has the required permission, it renders the requested route.
 * If the user does not have the required permission, it redirects the user to the home page.
 * @example <ProtectedRoute permissionIDs={[1, 2, 3]}><Page /></ProtectedRoute>
 */
const ProtectedRoute = ({ children, permissionIDs }: any) => {
  const { auth } = useAuth();
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
