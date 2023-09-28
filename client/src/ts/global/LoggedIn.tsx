import React, { useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const LoggedIn: React.FunctionComponent = ({ children }) => {
  const { auth } = useContext(AuthContext);
  const history = useNavigate();

  useEffect(() => {
    if (!auth.authenticated) {
      history("/login");
    }
  }, [auth, history]);

  return <>{children}</>;
};

export default LoggedIn;
