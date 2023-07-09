import { FC, useEffect, useReducer } from "react";
import { IUser } from "@/interfaces";
import { AuthContext, authReducer } from "./";
import tesloApi from "@/api/tesloApi";
import Cookies from "js-cookie";
import axios from "axios";

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
};

interface Props {
  children: React.ReactNode;
}

export const AuthProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      //*LLama endpoint
      const { data } = await tesloApi.post("/user/token");

      //*Revalidar token guardado  el nuevo
      const { token, user } = data;
      Cookies.set("token", token);

      //*dispatch login
      dispatch({ type: "[Auth] - Login", payload: user });
    } catch (error) {
      //*MAL
      console.log(error);
      //*Borrar el token
      Cookies.remove("token");
    }
  };

  const loginUser = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const { data } = await tesloApi.post("/user/login", { email, password });
      const { token, user } = data;
      Cookies.set("token", token);
      dispatch({ type: "[Auth] - Login", payload: user });
      return true;
    } catch (error) {
      return false;
    }
  };

  const registerUser = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ hasError: boolean; message?: string }> => {
    try {
      const { data } = await tesloApi.post("/user/register", {
        name,
        email,
        password,
      });
      const { token, user } = data;
      Cookies.set("token", token);
      dispatch({ type: "[Auth] - Logout" });
      return {
        hasError: false,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: error.response?.data.message,
        };
      }
      return {
        hasError: true,
        message: "No se pudi crear el usuario - intente de nuevo",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,

        //*Methods
        loginUser,
        registerUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
