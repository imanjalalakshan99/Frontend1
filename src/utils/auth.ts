import store from "store";

export function getToken() {
  return localStorage.getItem("token");
}
export function setToken(token: string) {
  localStorage.setItem("token", token);
}
export function removeToken() {
  localStorage.removeItem("token");
}

export function isLoggedIn() {
  return store.getState().auth.isLogged;
}
