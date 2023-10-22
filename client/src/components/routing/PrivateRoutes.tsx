import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import Layout from "../general/Layout";
import { useCheckAuth } from "../../hooks/useCheckAuth";

import LoadingCircle from "../general/LoadingCircle";

/**
 * This file contains the PrivateRoutes component, which is responsible for rendering the private routes of the application.
 * The private routes are the routes that require the user to be authenticated, the component is a wrapper for the private routes.
 * It checks if the user is authenticated by using the useCheckAuth hook.
 * If the user is authenticated, it renders the requested route.
 * If the user is not authenticated, it redirects the user to the login page.
 * @example
 * <PrivateRoutes>
 *    <Route path="/" element={<PrivateRoutes />}>
 *      <Route index element={<Dashboard />} />
 *    </Route>
 * </PrivateRoutes>
 */
const PrivateRoutes: React.FunctionComponent = () => {
  const { checkAuth, isAuthLoading } = useCheckAuth();
  const { auth } = useAuth();
  const location = useLocation();

  // Calls checkAuth on (re)render of routes
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return isAuthLoading ? (
    <LoadingCircle />
  ) : auth.authenticated ? (
    <Layout />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoutes;
