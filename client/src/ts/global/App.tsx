import React, { useCallback, useContext, useState } from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import { AuthContext } from "../global/AuthContext";
import api from "../utils/api";
import Dashboard from "../members/Dashboard";
import MemberOverview from "../members/MemberOverview";
import Login from "../members/Login";
import Nav from "./navigation/Nav";
import NotFound from "./NotFound";
import MemberProfile from "../members/member-page/MemberPage";
import ChangePassword from "../members/ChangePassword";
import DirectorsHistory from "../members/DirectorsHistory";
import { useEffect } from "react";
import { authReducerActionType } from "./globalTypes";
import LoadingCircle from "./LoadingCircle";

const App: React.FunctionComponent = () => {
  const [checkAuthLoading, setCheckAuthLoading] = useState(true);
  const { auth, dispatchAuth } = useContext(AuthContext);

  /**
   * Checks if the user is (still) authenticated
   * and retrieves the data of the logged in user
   */
  const checkAuth = useCallback(() => {
    // Tries to retrieve the user data
    api
      .get("auth/user-data")
      .then((res) => {
        // If the retrieval of the user data is succesfull the user is authenticated
        if (res.status === 200) {
          console.log(res.data.permissions);
          const userID = res.data.mitgliedID;
          const userName = res.data.name;
          const permissions = res.data.permissions;
          dispatchAuth({
            type: authReducerActionType.authenticate,
            payload: { userID, userName, permissions },
          });
        } else {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
        }
        setCheckAuthLoading(false);
      })
      .catch((err) => {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
        setCheckAuthLoading(false);
      });
  }, [dispatchAuth]);

  // Calls checkAuth on (re)render of routes
  useEffect(() => checkAuth(), [checkAuth]);

  /**
   * Renders the specified component if the user is authenticated otherwise
   * the user gets redirected to the login page
   */
  const PrivateRoute = ({ component: Component, ...rest }: any) => {
    return checkAuthLoading ? (
      <LoadingCircle />
    ) : (
      <Route
        {...rest}
        render={(props) => (auth.authenticated ? <Component {...props} /> : <Redirect to={{ pathname: "/login" }} />)}
      />
    );
  };

  /**
   * Renders the login component if the user is not authenticated otherwise
   * the user gets redirected to the dashboard page
   */
  const LoginRoute = ({ component: Component, ...rest }: any) => {
    return checkAuthLoading ? (
      <LoadingCircle />
    ) : (
      <Route
        {...rest}
        render={(props) => (!auth.authenticated ? <Component {...props} /> : <Redirect to={{ pathname: "/" }} />)}
      />
    );
  };

  /**
   * Renders the specified component if the user has the given permission
   * If not the user gets redirected to the dashboard page
   */
  const ProtectedRoute = ({ component: Component, permissionID, ...rest }: any) => {
    /**
     * Checks if the currently logged in user has the permission number
     * @param permissionNumber number/id of the permission
     * @returns true if the user has the given permission
     */
    const checkForPermission = (permissionNumber: number) => {
      let userIsPermitted = false;
      auth.permissions.forEach((permission) => {
        userIsPermitted = permission.permissionID === permissionNumber;
      });
      return userIsPermitted;
    };

    return (
      <Route
        {...rest}
        render={(props) =>
          checkForPermission(permissionID) ? <Component {...props} /> : <Redirect to={{ pathname: "/" }} />
        }
      />
    );
  };

  return (
    <HashRouter>
      {
        // Renders the Nav componenent if the user is authenticated
        auth.authenticated ? <Nav /> : null
      }
      <Switch>
        <PrivateRoute exact path="/user-change-password" component={ChangePassword} />
        <PrivateRoute exact path="/" component={Dashboard} />
        <PrivateRoute exact path="/gesamtuebersicht" component={MemberOverview} />
        <PrivateRoute exact path="/vorstand" component={Dashboard} />
        <PrivateRoute exact path="/ewigervorstand" component={DirectorsHistory} />
        <PrivateRoute exact path="/geburtstage" component={Dashboard} />
        <PrivateRoute exact path="/traineebereich" component={Dashboard} />
        <PrivateRoute exact path="/kuratoren" component={Dashboard} />
        <PrivateRoute exact path="/projekte" component={Dashboard} />
        <PrivateRoute exact path="/veranstaltungen" component={Dashboard} />
        <PrivateRoute exact path="/mm-tracking" component={Dashboard} />
        <PrivateRoute exact path="/pl-qm-tool" component={Dashboard} />
        <PrivateRoute exact path="/raumreservierung" component={Dashboard} />
        <PrivateRoute exact path="/innovationsmanagement" component={Dashboard} />
        <PrivateRoute exact path="/meine-funktionen" component={Dashboard} />
        <PrivateRoute exact path="/weitere-funktionen" component={Dashboard} />
        <PrivateRoute exact path="/kvp" component={Dashboard} />
        <PrivateRoute exact path="/gesamtuebersicht/:id" component={MemberProfile} />
        <LoginRoute exact path="/login" component={Login} />
        <PrivateRoute path="*" component={NotFound} />
      </Switch>
    </HashRouter>
  );
};

export default App;
