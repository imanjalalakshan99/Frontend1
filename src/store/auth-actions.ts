import { AppThunk } from "store";
import { getToken, removeToken, setToken } from "utils/auth";
import fetchApi from "utils/fetchApi";
import { authActions } from "./auth-slice";

export const authenticate = (): AppThunk => {
  return async (dispatch, getState) => {
    if (!getToken()) {
      return;
    }
    try {
      const response = await fetchApi("/api/auth", {
        method: "GET",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message ? data.message : "Token is not valid.");
      }
      const data = await response.json();
      dispatch(authActions.setUser(data));
      console.log(data);
    } catch (error) {
      console.log(error);
      dispatch(authActions.setUser(undefined));
      removeToken();
    }
  };
};

export const login = (email: string, password: string): AppThunk => {
  return async (dispatch, getState) => {
    dispatch(authActions.setLoading(true));
    dispatch(authActions.setMessage(undefined));
    dispatch(authActions.setErrorMessage(undefined));
    try {
      const response = await fetchApi("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message ? data.message : "Login failed!");
      }
      const data = await response.json();
      dispatch(authActions.setUser(data.user));
      setToken(data.token);
      localStorage.setItem("token", data.token);
      dispatch(authActions.setMessage("Login successful!"));
    } catch (error: any) {
      let message = "Login failed! Please try again.";
      if (error instanceof Error) message = error.message;
      dispatch(authActions.setErrorMessage(message));
    }
    dispatch(authActions.setLoading(false));
  };
};

export const register = (
  email: string,
  password: string,
  name: string,
  phone: string,
  dateOfBirth: string
): AppThunk => {
  return async (dispatch, getState) => {
    dispatch(authActions.setLoading(true));
    dispatch(authActions.setMessage(undefined));
    dispatch(authActions.setErrorMessage(undefined));
    try {
      const response = await fetchApi("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, name, phone, dateOfBirth }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message ? data.message : "Signup failed!");
      }
      dispatch(authActions.setMessage("Signup successful!"));
    } catch (error) {
      console.log(error);
      const errorMessage =
        typeof error === "string" ? error : "Signup failed! Please try again.";
      dispatch(authActions.setErrorMessage(errorMessage));
    }
    dispatch(authActions.setLoading(false));
  };
};

export const logout = (): AppThunk => {
  return async (dispatch, getState) => {
    dispatch(authActions.setUser(undefined));
    removeToken();
  };
};
