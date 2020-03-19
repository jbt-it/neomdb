import React from "react";
import {HashRouter, Route, Switch} from "react-router-dom";

import Dashboard from "../members/Dashboard";
import Login from "../members/Login";
import Nav from "./navigation/Nav";

const App: React.FunctionComponent = () => {

  return (
    <HashRouter>
      <Nav/>
      <Switch>
        <Route exact path = "/" component = {Dashboard} />
        <Route exact path = "/gesamtuebersicht" component = {Dashboard} />
        <Route exact path = "/vorstand" component = {Dashboard} />
        <Route exact path = "/geburtstage" component = {Dashboard} />
        <Route exact path = "/traineebereich" component = {Dashboard} />
        <Route exact path = "/kuratoren" component = {Dashboard} />
        <Route exact path = "/projekte" component = {Dashboard} />
        <Route exact path = "/veranstaltungen" component = {Dashboard} />
        <Route exact path = "/mm-tracking" component = {Dashboard} />
        <Route exact path = "/pl-qm-tool" component = {Dashboard} />
        <Route exact path = "/raumreservierung" component = {Dashboard} />
        <Route exact path = "/innovationsmanagement" component = {Dashboard} />
        <Route exact path = "/meine-funktionen" component = {Dashboard} />
        <Route exact path = "/weitere-funktionen" component = {Dashboard} />
        <Route exact path = "/kvp" component = {Dashboard} />
        <Route exact path = "/login" component = {Login} />
      </Switch>
    </HashRouter>
  );
};

export default App;
