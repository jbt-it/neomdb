import React, { useContext } from "react";
import {HashRouter, Route, Switch, Redirect} from "react-router-dom";
import decode from "jwt-decode";

import Dashboard from "../members/Dashboard";
import Login from "../members/Login";
import Nav from "./navigation/Nav";

const App: React.FunctionComponent = () => {

  /**
   * Checks if token in local storage is still valid
   */
  const checkAuth = (): boolean => {
    const token = localStorage.getItem("token");
    if (!token){
      return false;
    } else {
      try {
        const { exp } = decode(token);

        // JWT gives expiration time in seconds therefore date needs to be
        // Converted from miliseconds
        if (exp < new Date().getTime() / 1000) {
          return false;
        } else {
          return true;
        }
      } catch {
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
        checkAuth() ? <Nav/> : null
      }
      <Switch>
        <PrivateRoute exact path = "/" component = {Dashboard} />
        <PrivateRoute exact path = "/gesamtuebersicht" component = {Dashboard} />
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
      </Switch>
    </HashRouter>
  );
};

export default App;
