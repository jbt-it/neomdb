// React imports
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import TraineeSection from "./pages/trainees/TraineeSection";
import InternalProject from "./pages/trainees/InternalProject";

// events and workshop pages
import WorkshopsOverview from "./pages/events/WorkshopsOverview";
import WorkshopDetails from "./pages/events/WorkshopDetails";
import EventDetails from "./pages/events/EventDetails";
import EventsOverview from "./pages/events/EventsOverview";

// project pages
import ProjectOverview from "./pages/projects/ProjectOverview";

// finance pages
import FinanceOverview from "./pages/finance/FinanceOverview";
import MembershipFee from "./pages/finance/MembershipFee";
import MiscFee from "./pages/finance/MiscFee";

// other pages
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import FieldSectionTest from "./pages/FieldSectionTest";
import InfoSectionTest from "./pages/InfoSectionTest";
import WorkshopInstanceDetails from "./pages/events/WorkshopInstanceDetails";
import WorkshopInstanceFeedback from "./pages/events/WorkshopInstanceFeedback";
import WorkshopInstanceEvaluation from "./pages/events/WorkshopInstanceEvaluation";
import ProjectTendering from "./pages/projects/ProjectTendering";

/**
 * This component is responsible for rendering the app.
 * @returns the app component
 */

const App: React.FunctionComponent = () => {
  return (
    <LocalizationProvider adapterLocale="de" dateAdapter={AdapterDayjs}>
      <BrowserRouter>
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
            <Route path="traineebereich" element={<TraineeSection />} />
            <Route path="traineepraeferenzen" element={<TraineePreferences />} />
            <Route path="traineezuteilung" element={<AssignTrainees />} />
            <Route path="internes-projekt/:id" element={<InternalProject />} />
            <Route path="geburtstage" element={<Dashboard />} />
            <Route path="kuratoren" element={<Dashboard />} />
            <Route path="projekte">
              <Route index element={<ProjectOverview />} />
              <Route
                path="projektausschreibung"
                element={
                  <ProtectedRoutes permissionIDs={[19]}>
                    <ProjectTendering />
                  </ProtectedRoutes>
                }
              />
            </Route>
            <Route path="veranstaltungen">
              <Route index element={<EventsOverview />} />
              <Route path=":id" element={<EventDetails />} />
            </Route>
            <Route path="workshops">
              <Route index element={<WorkshopsOverview />} />
              <Route path=":id" element={<WorkshopDetails />} />
              <Route path=":id/:id" element={<WorkshopInstanceDetails />} />
              <Route path=":workshopID/:workshopInstanceID/feedback" element={<WorkshopInstanceFeedback />} />
              <Route
                path=":workshopID/:workshopInstanceID/feedbackauswertung"
                element={
                  <ProtectedRoutes permissionIDs={[4]}>
                    <WorkshopInstanceEvaluation />
                  </ProtectedRoutes>
                }
              />
            </Route>
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
            <Route
              path="finanzuebersicht"
              element={
                <ProtectedRoutes permissionIDs={[6]}>
                  <FinanceOverview />
                </ProtectedRoutes>
              }
            />
            <Route
              path="jahresbeitrag"
              element={
                <ProtectedRoutes permissionIDs={[6]}>
                  <MembershipFee />
                </ProtectedRoutes>
              }
            />
            <Route
              path="sonstigereinzug"
              element={
                <ProtectedRoutes permissionIDs={[6]}>
                  <MiscFee />
                </ProtectedRoutes>
              }
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  );
};

export default App;
