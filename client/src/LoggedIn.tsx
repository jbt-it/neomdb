import React, { useContext, useEffect, useCallback, useState } from "react";
import { AuthContext } from "./context/auth-context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "./utils/api";
import { authReducerActionType } from "./types/globalTypes";

import LoadingCircle from "./components/general/LoadingCircle";

const LoggedIn: React.FunctionComponent = ({ children }) => {
  const [checkAuthLoading, setCheckAuthLoading] = useState(true);
  const { auth, dispatchAuth } = useContext(AuthContext);
  const history = useNavigate();

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

  useEffect(() => {
    console.log("auth:" + auth.authenticated);
    if (!auth.authenticated) {
      history("/login");
    }
  }, [auth, history]);

  return checkAuthLoading ? <LoadingCircle /> : <>{children}</>;
};

export default LoggedIn;
