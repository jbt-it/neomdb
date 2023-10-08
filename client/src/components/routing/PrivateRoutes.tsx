import React, { useEffect, useCallback, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import api from "../../utils/api";
import { authReducerActionType } from "../../types/globalTypes";
import { useAuth } from "../../hooks/useAuth";
import Layout from "../general/Layout";

import LoadingCircle from "../general/LoadingCircle";

const PrivateRoutes: React.FunctionComponent = () => {
  const [checkAuthLoading, setCheckAuthLoading] = useState(true);
  const { auth, dispatchAuth } = useAuth();
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

  // Calls checkAuth on (re)render of routes
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return checkAuthLoading ? (
    <LoadingCircle />
  ) : auth.authenticated ? (
    <Layout />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoutes;
