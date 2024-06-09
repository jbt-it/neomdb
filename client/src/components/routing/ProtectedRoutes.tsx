import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { checkForPermission } from "../../utils/authUtils";

/**
 * This file contains the ProtectedRoute component, which is responsible for rendering the protected routes of the application.
 * The protected routes are the routes that require the user to have a specific permission, the component is a wrapper for the protected routes.
 * It checks if the user has the required permission by checking the permissions array of the user.
 * If the user has the required permission, it renders the requested route.
 * If the user does not have the required permission, it redirects the user to the home page.
 * @example
 * <Route
      path="/berechtigungen"
      element={
        <ProtectedRoutes permissionIDs={[1, 2, 3]}>
          <PermissionsOverview />
        </ProtectedRoutes>
      }
    />
   </Route>
 */
const ProtectedRoute = ({ children, permissionIDs }: any) => {
  const { auth } = useAuth();
  const location = useLocation();

  return checkForPermission(auth.permissions, permissionIDs) ? (
    <>{children}</>
  ) : (
    <Navigate to="/" state={{ from: location }} replace={true} />
  );
};

export default ProtectedRoute;
