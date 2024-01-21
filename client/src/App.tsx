// React imports
import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import PrivateRoutes from "./components/routing/PrivateRoutes";
import PublicRoutes from "./components/routing/PublicRoutes";
import ProtectedRoutes from "./components/routing/ProtectedRoutes";

// MUI imports
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/de";

/**
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

// events pages
import EventDetails from "./pages/events/EventDetails";
import EventsOverview from "./pages/events/EventsOverview";

// other pages
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import FieldSectionTest from "./pages/FieldSectionTest";
import InfoSectionTest from "./pages/InfoSectionTest";

/**
 * This component is responsible for rendering the app.
 * @returns the app component
 */

const App: React.FunctionComponent = () => {
  return (
    <LocalizationProvider adapterLocale="de" dateAdapter={AdapterDayjs}>
      <HashRouter>
        <Routes>
          <Route element={<PublicRoutes />}>
            <Route path="/login" element={<Login />} />
            <Route path="/passwort-vergessen" element={<ForgotPassword />} />
            <Route path="/passwort-vergessen-zuruecksetzen/:key" element={<ResetForgotPassword />} />
          </Route>
          <Route path="/" element={<PrivateRoutes />}>
            <Route index element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
            <Route path="gesamtuebersicht">
              <Route index element={<MemberOverview />} />
              <Route path=":id" element={<MemberProfile />} />
            </Route>
            <Route path="ressorts" element={<DepartmentOverview />} />
            <Route path="ewigervorstand" element={<DirectorsHistory />} />
            <Route path="traineebereich" element={<Dashboard />} />
            <Route path="traineepraeferenzen" element={<TraineePreferences />} />
            <Route path="traineezuteilung" element={<AssignTrainees />} />
            <Route path="geburtstage" element={<Dashboard />} />
            <Route path="kuratoren" element={<Dashboard />} />
            <Route path="projekte" element={<Dashboard />} />
            <Route path="veranstaltungen" element={<EventsOverview />} />
            <Route path="veranstaltungen/:id" element={<EventDetails />} />
            <Route path="mm-tracking" element={<Dashboard />} />
            <Route path="pl-qm-tool" element={<Dashboard />} />
            <Route path="innovationsmanagement" element={<Dashboard />} />
            <Route path="meine-funktionen" element={<Dashboard />} />
            <Route path="weitere-funktionen" element={<Dashboard />} />
            <Route path="mitgliederverwaltung" element={<MemberManagement />} />
            <Route path="kvp" element={<Dashboard />} />
            <Route path="passwort-aendern" element={<ChangePassword />} />
            <Route path="modularedarstellungtest" element={<InfoSectionTest />} />
            <Route path="modularesformulartest" element={<FieldSectionTest />} />
            <Route
              path="/berechtigungen"
              element={
                <ProtectedRoutes permissionIDs={[]}>
                  <PermissionsOverview />
                </ProtectedRoutes>
              }
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </LocalizationProvider>
  );
};

export default App;
