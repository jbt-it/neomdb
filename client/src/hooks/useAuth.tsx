import { useContext } from "react";
import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { AuthContext } from "../context/auth-context/AuthContext";
import { loginMember, logoutMember, resetPassword } from "../api/auth";
import { authReducerActionType } from "../types/globalTypes";
import { showErrorMessage, showSuccessMessage } from "../utils/toastUtils";
import { useNavigate } from "react-router-dom";
import { duration } from "@mui/material";

/**
 * Hook that handles the auth api calls, uses react-query
 * @returns logout function, login function
 */
const useAuth = () => {
  const { dispatchAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  // login function
  const { mutate: mutateLogin, isError: isLoginError } = useMutation({
    mutationFn: loginMember,
    onError: (err: AxiosError) => {
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
      showErrorMessage("Login fehlgeschlagen");
    },
    onSuccess: (data) => {
      dispatchAuth({
        type: authReducerActionType.authenticate,
        payload: {
          userID: data.data.userID,
          userName: data.data.userName,
          permissions: data.data.permissions,
          roles: data.data.roles,
        },
      });
      navigate("/");
    },
  });

  const login = (username: string, password: string) => {
    mutateLogin({ username, password });
  };

  // ------------------------------------------------------------------------------------------------
  // logout function
  const { mutate: mutateLogout } = useMutation({
    mutationFn: logoutMember,
    onError: (err: AxiosError) => {
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
      showErrorMessage("Logout fehlgeschlagen");
    },
    onSuccess: () => {
      dispatchAuth({ type: authReducerActionType.deauthenticate });
      navigate("/login");
    },
  });

  const logout = () => {
    mutateLogout();
  };

  // ------------------------------------------------------------------------------------------------
  // reset password function
  const { mutateAsync: mutateResetPassword } = useMutation({
    mutationFn: resetPassword,
    onError: (err: AxiosError) => {
      showErrorMessage("Passwort zurücksetzen fehlgeschlagen", 10000);
    },
    onSuccess: () => {
      showSuccessMessage(
        "Der Link zum Zurücksetzen des Passworts wurde an die angegebene E-Mail-Adresse gesendet.",
        10000
      );
    },
  });

  const sendResetPasswordLink = async (email: string) => {
    return await mutateResetPassword({ email });
  };

  return { login, isLoginError, logout, sendResetPasswordLink };
};

export default useAuth;
