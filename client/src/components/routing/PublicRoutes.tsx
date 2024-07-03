import React, { useContext, useEffect } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useCheckAuth } from "../../hooks/useCheckAuth";

import LoadingCircle from "../general/LoadingCircle";
import { AuthContext } from "../../context/auth-context/AuthContext";

/**
 * This file contains the PublicRoutes component, which is responsible for rendering the public routes of the application.
 * The public routes are the routes that require the user to be unauthenticated, the component is a wrapper for the public routes.
 * It checks if the user is authenticated by using the useCheckAuth hook.
 * If the user is authenticated, it redirects the user to the home page.
 * If the user is not authenticated, it renders the requested route.
 * @example
 * <PublicRoutes>
 *    <Route path="/login" element={<Login />} />
 * </PublicRoutes>
 */
const PublicRoutes: React.FunctionComponent = () => {
  const { checkAuth, isAuthLoading } = useCheckAuth();
  const { auth } = useContext(AuthContext);
  const location = useLocation();

  // Calls checkAuth on (re)render of routes
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return isAuthLoading ? (
    <LoadingCircle />
  ) : !auth.authenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default PublicRoutes;
