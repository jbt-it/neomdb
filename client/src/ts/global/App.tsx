import React, { useContext } from "react";
import {HashRouter, Route, Switch, Redirect} from "react-router-dom";
import decode from "jwt-decode";

import {AuthContext} from "../global/AuthContext";
import Dashboard from "../members/Dashboard";
import MemberOverview from "../members/MemberOverview";
import Login from "../members/Login";
import Nav from "./navigation/Nav";
import NotFound from "./NotFound";
import ChangePassword from "../members/ChangePassword";


const App: React.FunctionComponent = () => {
  const [authenticated, setAuthenticated,
        userID, setUserID, userName, setUserName] = useContext(AuthContext);

  /**
   * Checks if token in local storage is set or expired
   */
  const checkAuth = (): boolean => {
    const token = localStorage.getItem("token");
    if (!token){
      setAuthenticated(false);
      setUserID(null);
      setUserName(null);
      return false;
    } else {
      try {
        const { exp } = decode(token);

        // JWT gives expiration time in seconds therefore date needs to be
        // Converted from miliseconds
        if (exp < new Date().getTime() / 1000) {
          setAuthenticated(false);
          setUserID(null);
          setUserName(null);
          return false;
        } else {
          setAuthenticated(true);
          setUserID(JSON.parse(atob(token.split(".")[1])).mitgliedID);
          setUserName(JSON.parse(atob(token.split(".")[1])).name);
          return true;
        }
      } catch {
        setAuthenticated(false);
        setUserID(null);
        setUserName(null);
        return false;
      }
    }
  };

  /**
   * Renders the specified component if the user is authenticated otherwise
   * the user gets redirected to the login page
   */
  const PrivateRoute = ({component: Component, ...rest}: any) => {
    return(
      <Route {...rest} render = {props => (
        checkAuth() ? (
          <Component {...props}/>
        ) : (
          <Redirect to={{pathname: "/login"}}/>
        )
      )}/>
    );
  };

  return (
      <HashRouter>
      {
      // Renders the Nav componenent if the user is authenticated
      (authenticated ? <Nav/> : null)
      }
      <Switch>
        <PrivateRoute exact path = "/user-change-password" component = {ChangePassword} />
        <PrivateRoute exact path = "/" component = {Dashboard} />
        <PrivateRoute exact path = "/gesamtuebersicht" component = {MemberOverview} />
        <PrivateRoute exact path = "/vorstand" component = {Dashboard} />
        <PrivateRoute exact path = "/geburtstage" component = {Dashboard} />
        <PrivateRoute exact path = "/traineebereich" component = {Dashboard} />
        <PrivateRoute exact path = "/kuratoren" component = {Dashboard} />
        <PrivateRoute exact path = "/projekte" component = {Dashboard} />
        <PrivateRoute exact path = "/veranstaltungen" component = {Dashboard} />
        <PrivateRoute exact path = "/mm-tracking" component = {Dashboard} />
        <PrivateRoute exact path = "/pl-qm-tool" component = {Dashboard} />
        <PrivateRoute exact path = "/raumreservierung" component = {Dashboard} />
        <PrivateRoute exact path = "/innovationsmanagement" component = {Dashboard} />
        <PrivateRoute exact path = "/meine-funktionen" component = {Dashboard} />
        <PrivateRoute exact path = "/weitere-funktionen" component = {Dashboard} />
        <PrivateRoute exact path = "/kvp" component = {Dashboard} />
        <Route exact path = "/login" component = {Login} />
        <PrivateRoute path = "*" component = {NotFound} />
      </Switch>
    </HashRouter>
  );
};

export default App;
