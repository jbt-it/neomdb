import React from "react";
import {HashRouter, Route, Switch} from "react-router-dom";

import Dashboard from "../members/Dashboard";
import Login from "../members/Login";

const App: React.FunctionComponent = () => {

  return (
    <HashRouter>
      <Switch>
        <Route exact path = "/" component = {Dashboard} />
        <Route exact path = "/login" component = {Login} />
      </Switch>
    </HashRouter>
  );
};

export default App;
