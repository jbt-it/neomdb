import { useContext } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { AuthContext } from "../context/auth-context/AuthContext";
import { ChangePasswordParams, authReducerActionType } from "../types/globalTypes";
import { showErrorMessage, showSuccessMessage } from "../utils/toastUtils";
import {
  loginMember,
  logoutMember,
  sendResetLink,
  changePassword as changePasswordApi,
  resetForgottenPassword as resetForgottenPasswordApi,
} from "../api/auth";

/**
 * Hook that handles the auth api calls, uses react-query
 * @returns logout function, login function, sendResetPasswordLink function, resetForgottenPassword function, changePassword function
 */
const useAuth = () => {
  const { dispatchAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  // ------------------------------------------------------------------------------------------------
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

  /**
   * Login function
   * @param username - The username of the member
   * @param password - The password of the member
   * @returns The userID, username, permissions and roles of the member
   * @example
   * login("username", "password");
   */
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

  /**
   * Logout function
   * @example
   * logout();
   */
  const logout = () => {
    mutateLogout();
  };

  // ------------------------------------------------------------------------------------------------
  // change password function
  const { mutateAsync: mutateChangePassword } = useMutation({
    mutationFn: changePasswordApi,
    onError: (err: AxiosError) => {
      showErrorMessage("Passwort ändern fehlgeschlagen", 10000);
    },
    onSuccess: () => {
      showSuccessMessage("Passwort erfolgreich geändert", 10000);
    },
  });

  /**
   * Change password function
   * @param changePasswordData - The old password, the new password and the userID of the member
   * @returns The response of the change password request
   * @example
   * changePassword({ oldPassword: "oldPassword", newPassword: "newPassword", userID: 1234 });
   */
  const changePassword = async (changePasswordData: ChangePasswordParams) => {
    return await mutateChangePassword(changePasswordData);
  };

  // ------------------------------------------------------------------------------------------------
  // send reset password link function
  const { mutateAsync: mutateResetPasswordLink } = useMutation({
    mutationFn: sendResetLink,
    onError: (err: AxiosError) => {
      showErrorMessage("Passwort zurücksetzen fehlgeschlagen", 10000);
    },
    onSuccess: () => {
      showSuccessMessage("Link zum Zurücksetzen wurde gesendet", 10000);
    },
  });

  /**
   * Send reset password link function
   * @param email - The email of the member
   * @returns The response of the send reset password link request
   * @example
   * sendResetPasswordLink("email");
   */
  const sendResetPasswordLink = async (email: string) => {
    return await mutateResetPasswordLink(email);
  };

  // ------------------------------------------------------------------------------------------------
  // set new password function
  const { mutateAsync: mutateResetForgottenPassword } = useMutation({
    mutationFn: resetForgottenPasswordApi,
    onError: (err: AxiosError) => {
      showErrorMessage("Passwort ändern fehlgeschlagen", 10000);
    },
    onSuccess: () => {
      showSuccessMessage("Passwort erfolgreich geändert", 10000);
    },
  });

  /**
   * Reset forgotten password function
   * @param data - The email, the key and the new password of the member
   * @returns The response of the reset forgotten password request
   * @example
   * resetForgottenPassword({ email: "email, key: "key", newPassword: "newPassword" });
   */
  const resetForgottenPassword = async (data: { email: string; key: string; newPassword: string }) => {
    return await mutateResetForgottenPassword(data);
  };

  // all functions that are returned
  return { login, isLoginError, logout, sendResetPasswordLink, resetForgottenPassword, changePassword };
};

export default useAuth;
