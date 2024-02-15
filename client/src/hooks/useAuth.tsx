import { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { AxiosError } from "axios";
import { AuthContext } from "../context/auth-context/AuthContext";
import { getUserAuthenticated, loginMember, logoutMember } from "../api/auth";
import { authReducerActionType } from "../types/globalTypes";
import { showErrorMessage } from "../utils/toastUtils";
import { useNavigate } from "react-router-dom";

/**
 * Hook that handles the auth api calls, uses react-query
 * @returns logout function
 */
const useAuth = () => {
  const { auth, dispatchAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAuthLoading, setIsAuthLoading] = useState(false);

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

  return { login, isLoginError, logout };
};

export default useAuth;
