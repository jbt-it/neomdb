// React imports
import React, { memo, useCallback, useContext, useState } from "react";
import { HashRouter, Route, Routes, Navigate, useLocation, useRoutes, Outlet } from "react-router-dom";
import { useEffect } from "react";
import PrivateRoutes from "./components/routing/PrivateRoutes";
import PublicRoutes from "./components/routing/PublicRoutes";
import ProtectedRoutes from "./components/routing/ProtectedRoutes";
import Layout from "./components/general/Layout";

// MUI imports
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// utils imports
import { AuthContext } from "./context/auth-context/AuthContext";
import api from "./utils/api";
import { doesPermissionsHaveSomeOf } from "./utils/authUtils";

// component imports
import Nav from "./components/navigation/Nav";
import LoadingCircle from "./components/general/LoadingCircle";

/*
 * page imports
 */
// members pages
import Dashboard from "./pages/members/Dashboard";
import MemberOverview from "./pages/members/MemberOverview";
import MemberManagement from "./pages/members/MemberManagement";
import DepartmentOverview from "./pages/members/DepartmentOverview";
import PermissionsOverview from "./pages/members/PermissionsOverview";
import MemberProfile from "./pages/members/member-page/MemberPage";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import ResetForgotPassword from "./pages/ResetForgotPassword";
import DirectorsHistory from "./pages/members/DirectorsHistory";

// trainee pages
import TraineePreferences from "./pages/trainees/TraineePreferences";
import AssignTrainees from "./pages/trainees/AssignTrainees";

// other pages
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import FieldSectionTest from "./pages/FieldSectionTest";
import InfoSectionTest from "./pages/InfoSectionTest";

import { authReducerActionType } from "./types/globalTypes";

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

  // Calls checkAuth on (re)render of routes
  useEffect(() => checkAuth(), [checkAuth]);

  /**
   * Renders the specified component if the user is authenticated otherwise
   * the user gets redirected to the login page
   */
  // const PrivateRoutes = memo(() => {
  //   const location = useLocation();
  //   return checkAuthLoading ? (
  //     <LoadingCircle />
  //   ) : auth.authenticated ? (
  //     <Outlet />
  //   ) : (
  //     <Navigate to="/login" state={{ from: location }} replace />
  //   );
  // });

  /**
   * Renders the login component if the user is not authenticated otherwise
   * the user gets redirected to the dashboard page
   */
  const LoginRoute: React.FunctionComponent = memo(() => {
    const { state } = useLocation();

    if (auth.authenticated === true) {
      return <Navigate to={state?.from || "/"} />;
    }

    return checkAuthLoading ? <LoadingCircle /> : <Outlet />;
  });

  /**
   * Renders the specified component if the user has the given permission
   * If not the user gets redirected to the dashboard page
   * @param component The component, that should be displayed
   * @param permissionIDs The array of permissions that should be checked
   * (if the array is empty, any user with permissions can access the given component)
   */
  const ProtectedRoute = memo(({ component: Component, permissionIDs, ...rest }: any) => {
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

    return checkAuthLoading ? (
      <LoadingCircle />
    ) : checkAuthLoading ? (
      <LoadingCircle />
    ) : checkForPermission(permissionIDs) ? (
      <Outlet />
    ) : (
      <Navigate to="/" state={{ from: location }} replace />
    );
  });
  /*
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <HashRouter>
        {
          // Renders the Nav componenent if the user is authenticated
          auth.authenticated ? <Nav /> : null
        }
        <Routes>

          <Route path="/login" element={Login} />

          <Route path="/passwort-vergessen" element={ForgotPassword} />
          <Route path="/passwort-vergessen-zuruecksetzten/:key" element={ResetForgotPassword} />


          <Route element={<PrivateRoutes />}>
            <Route path="/user-change-password" element={ChangePassword} />
            <Route path="/" element={Dashboard} />
            <Route path="/gesamtuebersicht" element={MemberOverview} />
            <Route path="/ressorts" element={DepartmentOverview} />
            <Route path="/ewigervorstand" element={DirectorsHistory} />
            <Route path="/geburtstage" element={Dashboard} />
            <Route path="/traineebereich" element={Dashboard} />
            <Route path="/kuratoren" element={Dashboard} />
            <Route path="/projekte" element={Dashboard} />
            <Route path="/veranstaltungen" element={Dashboard} />
            <Route path="/mm-tracking" element={Dashboard} />
            <Route path="/pl-qm-tool" element={Dashboard} />
            <Route path="/raumreservierung" element={Dashboard} />
            <Route path="/innovationsmanagement" element={Dashboard} />
            <Route path="/meine-funktionen" element={Dashboard} />
            <Route path="/weitere-funktionen" element={Dashboard} />
            <Route path="/mitgliederverwaltung" element={MemberManagement} />
            <Route path="/traineepraeferenzen" element={TraineePreferences} />
            <Route path="/traineezuteilung" element={AssignTrainees} />
            <Route path="/modularesformulartest" element={FieldSectionTest} />
            <Route path="/modularedarstellungtest" element={InfoSectionTest} />
            <Route path="/kvp" element={Dashboard} />
            <Route path="/gesamtuebersicht/:id" element={MemberProfile} />
            <Route path="*" element={NotFound} />
          </Route>


          <Route element={<ProtectedRoute />}>
            <Route path="/berechtigungen" element={PermissionsOverview} permissionIDs={[]} />
          </Route>

        </Routes>
      </HashRouter>
    </LocalizationProvider>
  );
};
*/

  const routes = useRoutes([
    {
      path: "/login",
      element: (
        <PublicRoutes>
          <Login />
        </PublicRoutes>
      ),
    },
    {
      path: "/passwort-vergessen",
      element: (
        <PublicRoutes>
          <ForgotPassword />
        </PublicRoutes>
      ),
    },
    {
      path: "/passwort-vergessen-zuruecksetzen/:key",
      element: (
        <PublicRoutes>
          <ResetForgotPassword />
        </PublicRoutes>
      ),
    },
    {
      path: "/",
      element: (
        <PrivateRoutes>
          <Layout />
        </PrivateRoutes>
      ),
      children: [
        {
          path: "gesamtuebersicht",
          children: [
            {
              index: true,
              element: <MemberOverview />,
            },
            {
              path: ":id",
              element: <MemberProfile />,
            },
          ],
        },
        { path: "modularedarstellungtest", element: <InfoSectionTest /> },
        { path: "ressorts", element: <DepartmentOverview /> },
        { path: "ewigervorstand", element: <DirectorsHistory /> },
        { path: "berechtigungen", element: <PermissionsOverview /> },
        { path: "user-change-password", element: <ChangePassword /> },
        { path: "traineepraeferenzen", element: <TraineePreferences /> },
        { path: "traineezuteilung", element: <AssignTrainees /> },
        { path: "modularesformulartest", element: <FieldSectionTest /> },
        { path: "geburtstage", element: <Dashboard /> },
        { path: "traineebereich", element: <Dashboard /> },
        { path: "kuratoren", element: <Dashboard /> },
        { path: "projekte", element: <Dashboard /> },
        { path: "veranstaltungen", element: <Dashboard /> },
        { path: "mm-tracking", element: <Dashboard /> },
        { path: "pl-qm-tool", element: <Dashboard /> },
        { path: "raumreservierung", element: <Dashboard /> },
        { path: "innovationsmanagement", element: <Dashboard /> },
        { path: "meine-funktionen", element: <Dashboard /> },
        { path: "weitere-funktionen", element: <Dashboard /> },
        { path: "mitgliederverwaltung", element: <MemberManagement /> },
        { path: "kvp", element: <Dashboard /> },
        { path: "user-change-password", element: <ChangePassword /> },
      ],
    },
    {
      path: "/berechtigungen",
      element: (
        <ProtectedRoutes permissionIDs={[]}>
          <PermissionsOverview />
        </ProtectedRoutes>
      ),
    },
    { path: "*", element: <NotFound /> },
  ]);

  return routes;
};

export default App;
