import React, { memo, useCallback, useContext, useState } from "react";
import { HashRouter, Route, useLocation, Routes, useRoutes } from "react-router-dom";
import { AuthContext } from "../global/AuthContext";
import api from "../utils/api";
import Dashboard from "../members/Dashboard";
import MemberOverview from "../members/MemberOverview";
import MemberManagement from "../members/MemberManagement";
import Login from "../members/Login";
import Nav from "./components/navigation/Nav";
import NotFound from "./NotFound";
import DepartmentOverview from "../members/DepartmentOverview";
import PermissionsOverview from "../members/PermissionsOverview";
import MemberProfile from "../members/member-page/MemberPage";
import ChangePassword from "../members/ChangePassword";
import ForgotPassword from "../members/ForgotPassword";
import ResetForgotPassword from "../members/ResetForgotPassword";
import DirectorsHistory from "../members/DirectorsHistory";
import { useEffect } from "react";
import { authReducerActionType } from "./globalTypes";
import LoadingCircle from "./components/LoadingCircle";
import { doesPermissionsHaveSomeOf } from "../utils/authUtils";
import TraineePreferences from "../trainees/TraineePreferences";
import FieldSectionTest from "./FieldSectionTest";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AssignTrainees from "../trainees/AssignTrainees";
import InfoSectionTest from "./InfoSectionTest";
import LoggedIn from "./LoggedIn";

/**
 * Interfaces for the location state of react-router-dom
 */
interface LocationState {
  from: {
    pathname: string;
  };
}

/**
 * Interfaces for the location state of react-router-dom
 */
interface LocationState {
  from: {
    pathname: string;
  };
}

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
  /*

  // Calls checkAuth on (re)render of routes
  useEffect(() => checkAuth(), [checkAuth]);

  /**
   * Renders the specified component if the user is authenticated otherwise
   * the user gets redirected to the login page
   *
  const PrivateRoute = memo(({ component: Component, ...rest }: any) => {
    return checkAuthLoading ? (
      <LoadingCircle />
    ) : (
      <Route
        {...rest}
        render={({ location, ...props }) =>
          auth.authenticated ? (
            <Component {...props} />
          ) : (
            <Redirect to={{ pathname: "/login", state: { from: location } }} />
          )
        }
      />
    );
  });

  /**
   * Renders the login component if the user is not authenticated otherwise
   * the user gets redirected to the dashboard page
   *
  const LoginRoute = memo(({ component: Component, ...rest }: any) => {
    const { state } = useLocation<LocationState>();

    if (auth.authenticated === true) {
      return <Redirect to={state?.from || "/"} />;
    }

    return checkAuthLoading ? <LoadingCircle /> : <Route {...rest} render={(props) => <Component {...props} />} />;
  });

  /**
   * Renders the specified component if the user has the given permission
   * If not the user gets redirected to the dashboard page
   * @param component The component, that should be displayed
   * @param permissionIDs The array of permissions that should be checked
   * (if the array is empty, any user with permissions can access the given component)
   *
  const ProtectedRoute = memo(({ component: Component, permissionIDs, ...rest }: any) => {
    /**
     * Checks if the currently logged in user has the permission numbers specified
     * @param permissionNumbers numbers/ids of the permissions (can be empty to indicate, that the user must have at least one permission)
     * @returns true if the user has the given permissions
     *
    const checkForPermission = (permissionNumbers: number[]) => {
      if (permissionNumbers.length === 0) {
        // Check if the given permissionNumbers array contains at least one permission id.
        return auth.permissions.length > 0;
      }
      return doesPermissionsHaveSomeOf(auth.permissions, permissionNumbers);
    };

    return checkAuthLoading ? (
      <LoadingCircle />
    ) : checkAuthLoading ? (
      <LoadingCircle />
    ) : (
      <Route
        {...rest}
        render={({ location, ...props }) =>
          checkForPermission(permissionIDs) ? (
            <Component {...props} />
          ) : (
            <Redirect to={{ pathname: "/", state: { from: location } }} />
          )
        }
      />
    );
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <HashRouter>
        {
          // Renders the Nav componenent if the user is authenticated
          auth.authenticated ? <Nav /> : null
        }
        <Switch>
          <PrivateRoute exact path="/user-change-password" component={ChangePassword} />
          <PrivateRoute exact path="/" component={Dashboard} />
          <PrivateRoute exact path="/gesamtuebersicht" component={MemberOverview} />
          <PrivateRoute exact path="/ressorts" component={DepartmentOverview} />
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
          <PrivateRoute exact path="/mitgliederverwaltung" component={MemberManagement} />
          <PrivateRoute exact path="/traineepraeferenzen" component={TraineePreferences} />
          <PrivateRoute exact path="/traineezuteilung" component={AssignTrainees} />
          <PrivateRoute exact path="/modularesformulartest" component={FieldSectionTest} />
          <PrivateRoute exact path="/modularedarstellungtest" component={InfoSectionTest} />
          <PrivateRoute exact path="/kvp" component={Dashboard} />
          <PrivateRoute exact path="/gesamtuebersicht/:id" component={MemberProfile} />
          <ProtectedRoute exact path="/berechtigungen" component={PermissionsOverview} permissionIDs={[]} />
          <LoginRoute exact path="/login" component={Login} />
          <Route exact path="/passwort-vergessen" component={ForgotPassword} />
          <Route exact path="/passwort-vergessen-zuruecksetzten/:key" component={ResetForgotPassword} />
          <PrivateRoute path="*" component={NotFound} />
        </Switch>
      </HashRouter>
    </LocalizationProvider>
  );
};
*/
  const routes = useRoutes([
    {
      path: "/",
      element: (
        <LoggedIn>
          <Dashboard />
        </LoggedIn>
      ),
    },
    {
      path: "/gesamtuebersicht",
      children: [
        {
          index: true,
          element: (
            <LoggedIn>
              <MemberOverview />
            </LoggedIn>
          ),
        },
        {
          path: ":id",
          element: (
            <LoggedIn>
              <MemberProfile />
            </LoggedIn>
          ),
        },
      ],
    },
    { path: "/login", element: <Login /> },
    { path: "*", element: <NotFound /> },
  ]);

  return routes;
  /*
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {
        // Renders the Nav componenent if the user is authenticated
        auth.authenticated ? <Nav /> : null
      }
      <Routes>
        <Route
          path="/"
          element={
            <LoggedIn>
              <Dashboard />
            </LoggedIn>
          }
        />
        <Route path="/gesamtuebersicht">
          <Route
            path=""
            element={
              <LoggedIn>
                <MemberOverview />
              </LoggedIn>
            }
          />
          <Route
            path=":id"
            element={
              <LoggedIn>
                <MemberProfile />
              </LoggedIn>
            }
          />
        </Route>

        <Route path="/login" element={<Login />} />
      </Routes>
    </LocalizationProvider>
  );*/
};

export default App;
